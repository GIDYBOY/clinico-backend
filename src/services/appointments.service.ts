import { PrismaClient, AppointmentStatus } from "../generated/prisma";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export const createAppointment = async (data: {
  patientId: string;
  doctorId: string;
  date: Date;
  note?: string;
}) => {
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

export const createAppointmentWithInvoice = async ({
  patientId,
  doctorId,
  date,
  note,
}: {
  patientId: string;
  doctorId: string;
  date: Date;
  note?: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    const patient = await tx.patient.findUnique({
      where: {userId: patientId}
    })

    const doctor = await tx.doctor.findUnique({
      where: { userId: doctorId },
    });

    if (!patient) return
    if (!doctor) return

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

    return appointment;
  });
};

export const getAppointmentsForUser = async (userId: string, role: string) => {
  if (role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new Error("Patient not found");

    return prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: { doctor: { include: { user: true } } },
    });
  }

  if (role === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new Error("Doctor not found");

    return prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: { patient: { include: { user: true } } },
    });
  }

  return []; // Admins won't use this
};

// export const getLatestUserAppointment = async (userId: string) => {
//   return prisma.appointment.findFirst({
//     where: {userId},
//     orderBy: {date: {
//       or
//     }},
    
//   })
// }

export const getAllAppointments = async () => {
  return prisma.appointment.findMany({
    include: {
      doctor: { include: { user: true } },
      patient: { include: { user: true } },
    },
  });
};

export const updateAppointmentStatus = async (id: string, status: string) => {
  return prisma.appointment.update({
    where: { id },
    data: { status: status as AppointmentStatus },
  });
};

export const deleteAppointment = async (id: string) => {
  return prisma.appointment.delete({ where: { id } });
};


export const isTimeSlotAvailable = async (
  doctorId: string,
  date: Date,
  excludeId?: string
) => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
      status: { in: ["SCHEDULED", "COMPLETED"] }, // ignore cancelled
    },
  });

  return !conflict; // return true if available
};

export const rescheduleAppointment = async (id: string, newDate: Date) => {
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) throw new Error("Appointment not found");

  const available = await isTimeSlotAvailable(
    appointment.doctorId,
    newDate,
    id
  );
  if (!available)
    throw new Error("Time slot is already booked for this doctor");

  return prisma.appointment.update({
    where: { id },
    data: { date: newDate },
  });
};


