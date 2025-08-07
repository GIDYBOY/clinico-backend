import cron from "node-cron";
import { PrismaClient } from "../generated/prisma";
import { sendMessage } from "../services/message.service";

const prisma = new PrismaClient();

export const startOverdueInvoiceJob = () => {
  // Run every day at 8AM
  cron.schedule("0 8 * * *", async () => {
    const now = new Date();
    const pastDue = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const overdue = await prisma.invoice.findMany({
      where: {
        status: "unpaid",
        createdAt: {
          lt: pastDue,
        },
      },
      include: {
        patient: { include: { user: true } },
      },
    });

    for (const invoice of overdue) {
      const user = invoice.patient.user;

      await sendMessage(
        user.id,
        user.id, // send to self (in-app notification)
        `Reminder: Invoice of ₦${
          invoice.amount
        } from ${invoice.createdAt.toLocaleDateString()} is still unpaid. Please pay promptly.`
      );

      // Optional email
      // await sendEmail(user.email, 'Overdue Invoice Reminder', `...`);
    }

    console.log(`[Overdue Invoice Job] Sent ${overdue.length} reminders`);
  });
};
