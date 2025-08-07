import bcrypt from "bcrypt";
import { PrismaClient, Departments } from "../generated/prisma";
import { create } from '../controllers/healthRecord.controller';
import { CreateDoctorDTO } from "../validators/doctor.validator";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export const getAllDoctors = async () => {
  return prisma.doctor.findMany({
    include: {
      user: true,
      appointments: true,
    },
  });
};

export const getDoctorById = async (id: string) => {
  return prisma.doctor.findUnique({
    where: { id },
    include: {
      user: true,
      appointments: true,
    },
  });
};

export const getDoctorByUserId = async (userId: string) => {
  return prisma.doctor.findUnique({
    where: { userId },
    include: {
      user: true,
      appointments: true,
    },
  });
};

export const getDoctorsByDepartment = async (department: string) => {
  // Validate department
  if (!Object.values(Departments).includes(department as Departments)) {
    throw new Error("Invalid department");
  }
  return prisma.doctor.findMany({
    where: { department: department as Departments },
    include: {
      user: true,
      appointments: true,
    },
  });
};

export const createDoctor = async (data: CreateDoctorDTO) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Check access code validity
  // const accessCode = await prisma.accessCode.findFirst({
  //   where: {
  //     code: data.accessCode,
  //     expiresAt: {
  //       gte: new Date(), // Check if the code is still valid
  //     },
  //   },
  // });

  // if (!accessCode) {
  //   throw new Error("Invalid or expired access code");
  // }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      role: "DOCTOR",
      doctor: {
        create: {
          specialization: data.specialization,
          department: data.department as Departments,
          education: data.education,
          certifications: data.certifications,
          yearsOfExperience: data.yearsOfExperience,
          medicalLicenseNumber: data.medicalLicenseNumber,
        },
      }
    },
  });
}

export const updateDoctorProfile = async (
  userId: string,
  data: Partial<{
    name: string;
    image: string;
    specialization: string;
    department: string;
  }>
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      image: data.image,
    },
  });

  const doctor = await prisma.doctor.update({
    where: { userId },
    data: {
      specialization: data.specialization,
      department: data.department as Departments,
    },
  });

  return { user: updatedUser, doctor };
};

export const deleteDoctor = async (id: string) => {
  return prisma.doctor.delete({
    where: { id },
  });
};


