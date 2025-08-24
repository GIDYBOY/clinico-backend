import cron from "node-cron";
import { PrismaClient } from '@prisma/client';
import { sendMessage } from "../services/message.service";
import { sendEmail } from "../utils/email";


const prisma = new PrismaClient();

export const startAppointmentReminderJob = () => {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: in24Hours,
          lt: new Date(in24Hours.getTime() + 60 * 60 * 1000), // 24–25h from now
        },
        status: "SCHEDULED",
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    for (const appt of upcomingAppointments) {
      await sendMessage(
        appt.doctor.user.id,
        appt.patient.user.id,
        "AppointMent Reminder",
        `Reminder: You have an appointment with Dr. ${
          appt.doctor.user.name
        } on ${appt.date.toLocaleString()}`
      );

      await sendMessage(
        appt.patientId,
        appt.doctorId,
        "AppointMent Reminder",
        `Reminder: You have an appointment with ${
          appt.patient.user.name
        } on ${appt.date.toLocaleString()}`
      );

      await sendEmail(
        appt.patient.user.email,
        "Appointment Reminder",
        `<p>Hi ${appt.patient.user.name},</p>
         <p>This is a reminder for your appointment with Dr. ${
           appt.doctor.user.name
         } at ${appt.date.toLocaleString()}.</p>`
      );
      
    }

    console.log(
      `[Reminder Job] Processed ${upcomingAppointments.length} appointments`
    );
  });
};

export const stopAppointmentReminderJob = () => {
  cron.getTasks().forEach((task) => {
    if (task.name === "appointmentReminderJob") {
      task.stop();
    }
  });
};


