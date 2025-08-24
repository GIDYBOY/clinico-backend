"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleAppointment = exports.isTimeSlotAvailable = exports.deleteAppointment = exports.updateAppointmentStatus = exports.getAllAppointments = exports.getAppointmentsForUser = exports.createAppointmentWithInvoice = exports.createAppointment = void 0;
const client_1 = require("@prisma/client");
const message_service_1 = require("../services/message.service");
const prisma = new client_1.PrismaClient({
    omit: {
        user: {
            password: true,
        },
    },
});
const createAppointment = async (data) => {
    return prisma.appointment.create({
        data: {
            patientId: data.patientId,
            doctorId: data.doctorId,
            date: data.date,
            note: data.note,
            status: "PENDING",
        },
    });
};
exports.createAppointment = createAppointment;
const createAppointmentWithInvoice = async ({ patientId, doctorId, date, note, }) => {
    return await prisma.$transaction(async (tx) => {
        const patient = await tx.patient.findUnique({
            where: { userId: patientId }
        });
        const doctor = await tx.doctor.findUnique({
            where: { userId: doctorId },
            include: { user: true },
        });
        if (!patient)
            return;
        if (!doctor)
            return;
        const appointment = await tx.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                date,
                status: "PENDING",
                note,
            },
        });
        await tx.invoice.create({
            data: {
                patientId: patient.id,
                appointmentId: appointment.id,
                amount: 50,
                status: "UNPAID",
            },
        });
        await (0, message_service_1.sendMessageFromAdmin)(patient.userId, "Clinico: Appointment Created", `The status of your appointment with Dr. ${doctor.user.name} has been set to PENDING.
      Please make payment to validate your appointment`);
        return appointment;
    });
};
exports.createAppointmentWithInvoice = createAppointmentWithInvoice;
const getAppointmentsForUser = async (userId, role) => {
    if (role === "PATIENT") {
        const patient = await prisma.patient.findUnique({ where: { userId } });
        if (!patient)
            throw new Error("Patient not found");
        return prisma.appointment.findMany({
            where: { patientId: patient.id },
            include: { doctor: { include: { user: true } } },
        });
    }
    if (role === "DOCTOR") {
        const doctor = await prisma.doctor.findUnique({ where: { userId } });
        if (!doctor)
            throw new Error("Doctor not found");
        return prisma.appointment.findMany({
            where: { doctorId: doctor.id },
            include: { patient: { include: { user: true, healthRecords: true } } },
        });
    }
    return [];
};
exports.getAppointmentsForUser = getAppointmentsForUser;
const getAllAppointments = async () => {
    return prisma.appointment.findMany({
        include: {
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
        },
    });
};
exports.getAllAppointments = getAllAppointments;
const updateAppointmentStatus = async (id, status) => {
    return prisma.appointment.update({
        where: { id },
        data: { status: status },
    });
};
exports.updateAppointmentStatus = updateAppointmentStatus;
const deleteAppointment = async (id) => {
    return prisma.appointment.delete({ where: { id } });
};
exports.deleteAppointment = deleteAppointment;
const isTimeSlotAvailable = async (doctorId, date, excludeId) => {
    const doctor = await prisma.doctor.findUnique({
        where: { userId: doctorId },
    });
    if (!doctor)
        throw new Error("Doctor not found");
    const conflict = await prisma.appointment.findFirst({
        where: {
            doctorId: doctor.id,
            date,
            status: { in: ["SCHEDULED", "COMPLETED"] },
            ...(excludeId && {
                id: { not: excludeId },
            }),
        },
    });
    return !conflict;
};
exports.isTimeSlotAvailable = isTimeSlotAvailable;
const rescheduleAppointment = async (id, newDate) => {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment)
        throw new Error("Appointment not found");
    const available = await (0, exports.isTimeSlotAvailable)(appointment.doctorId, newDate, id);
    if (!available)
        throw new Error("Time slot is already booked for this doctor");
    return prisma.appointment.update({
        where: { id },
        data: { date: newDate },
    });
};
exports.rescheduleAppointment = rescheduleAppointment;
