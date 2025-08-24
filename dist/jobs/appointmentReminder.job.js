"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopAppointmentReminderJob = exports.startAppointmentReminderJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const message_service_1 = require("../services/message.service");
const email_1 = require("../utils/email");
const prisma = new client_1.PrismaClient();
const startAppointmentReminderJob = () => {
    // Runs every hour
    node_cron_1.default.schedule("0 * * * *", async () => {
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
            await (0, message_service_1.sendMessage)(appt.doctor.user.id, appt.patient.user.id, "AppointMent Reminder", `Reminder: You have an appointment with Dr. ${appt.doctor.user.name} on ${appt.date.toLocaleString()}`);
            await (0, message_service_1.sendMessage)(appt.patientId, appt.doctorId, "AppointMent Reminder", `Reminder: You have an appointment with ${appt.patient.user.name} on ${appt.date.toLocaleString()}`);
            await (0, email_1.sendEmail)(appt.patient.user.email, "Appointment Reminder", `<p>Hi ${appt.patient.user.name},</p>
         <p>This is a reminder for your appointment with Dr. ${appt.doctor.user.name} at ${appt.date.toLocaleString()}.</p>`);
        }
        console.log(`[Reminder Job] Processed ${upcomingAppointments.length} appointments`);
    });
};
exports.startAppointmentReminderJob = startAppointmentReminderJob;
const stopAppointmentReminderJob = () => {
    node_cron_1.default.getTasks().forEach((task) => {
        if (task.name === "appointmentReminderJob") {
            task.stop();
        }
    });
};
exports.stopAppointmentReminderJob = stopAppointmentReminderJob;
