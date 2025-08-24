import { PrismaClient, Role } from '@prisma/client';
import { CreateAdminDTO } from "../validators/user.validator";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export const createAdmin = async (data: CreateAdminDTO) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const admin = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      gender: data.gender,
      password: hashedPassword,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      role: "ADMIN",
    },
  });

  return admin;
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      doctor: true,
      patient: true,
    },
  });
};

export const generateAccessCode = async (adminId: string) => {
  const code = crypto.randomUUID();
  await prisma.accessCode.create({
    data: {
      code,
      createdById: adminId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return code;
}

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      doctor: true,
      patient: true,
    },
  });
};

export const updateUserRole = async (id: string, role: Role) => {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};



export const getDashboardStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalDoctors = await prisma.user.count({ where: { role: "DOCTOR" } });
  const totalPatients = await prisma.user.count({ where: { role: "PATIENT" } });
  const totalAppointments = await prisma.appointment.count();
  const totalInvoices = await prisma.invoice.count();

  return {
    totalUsers,
    totalDoctors,
    totalPatients,
    totalAppointments,
    totalInvoices,
  };
};