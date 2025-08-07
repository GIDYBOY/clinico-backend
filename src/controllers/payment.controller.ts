// src/controllers/payment.controller.ts

import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "../generated/prisma";
import dotenv from "dotenv";
import { sendEmail } from "../utils/email";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const prisma = new PrismaClient();

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { invoiceId } = req.body;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      // payment_method_types: ["card"],
      mode: "payment",
      customer_email: invoice.patient.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Medical Appointment Invoice",
              description: `Invoice ID: ${invoice.id}`,
            },
            unit_amount: Math.round(invoice.amount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      success_url:
        "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/payment-canceled",
      metadata: {
        invoiceId: invoice.id,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create Stripe Checkout session" });
  }
};

export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig || typeof sig !== "string") {
    res.status(400).send("Missing or invalid Stripe signature");
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err);
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid" && session.metadata?.invoiceId) {
        const invoiceId = session.metadata.invoiceId;

        // Find the invoice with appointment and user
        const invoice = await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: "PAID",
            paidAt: new Date(),
            reference: session.payment_intent?.toString() ?? undefined,
            appointment: {
              update: {
                status: "SCHEDULED",
              },
            },
          },
          include: {
            appointment: {
              include: {
                doctor: {
                  include: { user: true },
                },
                patient: {
                  include: { user: true },
                },
              },
            },
          },
        });

        // Email notifications
        const patientEmail = invoice.appointment.patient.user.email;
        const doctorEmail = invoice.appointment.doctor.user.email;

        await sendEmail(
          patientEmail,
          "Your appointment is now scheduled",
          `<p>Your payment has been received. Your appointment with Dr. ${invoice.appointment.doctor.user.name} is now scheduled for ${invoice.appointment.date}.</p>`,
        );

        await sendEmail(
          doctorEmail,
          "New appointment scheduled",
          `<p>A new appointment has been scheduled with ${invoice.appointment.patient.user.name} for ${invoice.appointment.date}.</p>`,
        );

        console.log(
          `✅ Invoice ${invoiceId} marked as PAID and notifications sent`
        );
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send("Webhook received");
  } catch (err) {
    console.error("❌ Error handling Stripe webhook:", err);
    res.status(500).send("Internal Server Error");
  }
};
