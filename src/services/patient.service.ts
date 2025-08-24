import { PrismaClient } from '@prisma/client';
import {CreatePatientDTO} from "../validators/patient.validator";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export const createPatient = async (data: CreatePatientDTO) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
        name: data.name,
        username: data.username,
        email: data.email,
        gender: data.gender,
        password: hashedPassword,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        role: "PATIENT",
        patient: {
            create: {
            bloodGroup: data.bloodGroup,
            allergies: data.allergies,
            existingConditions: data.existingConditions,
            currentMedications: data.currentMedications,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyContactPhone,
            emergencyContactLocation: data.emergencyContactLocation,
            emergencyContactRelationship: data.emergencyContactRelationship,
            primaryPhysician: data.primaryPhysician,
            },
        },
        },
    });

    return user;
};

export const getAllPatients = async () => {
  return prisma.patient.findMany({
    include: {
      user: true,
      appointments: true,
      invoices: true,
      healthRecords: true,
    },
  });
};

export const getPatientById = async (id: string) => {
  return prisma.patient.findUnique({
    where: { id },
    include: {
      user: true,
      appointments: true,
      invoices: true,
      healthRecords: true,
    },
  });
};

export const getPatientByUserId = async (userId: string) => {
  return prisma.patient.findUnique({
    where: { userId: userId },
    include: {
      user: true,
      appointments: true,
      invoices: true,
      healthRecords: true,
    },
  });
};

export const updatePatientProfile = async (
  userId: string,
  data: Partial<{ name: string; image: string }>
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const deletePatient = async (id: string) => {
  return prisma.patient.delete({
    where: { id },
  });
};
