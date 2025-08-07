import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export const getRecordsForPatient = async (patientId: string) => {
  return prisma.healthRecord.findMany({
    where: { patientId },
    orderBy: { date: "desc" },
  });
};

export const createRecord = async (patientId: string, record: string, image: string ="") => {
  return prisma.healthRecord.create({
    data: {
      patientId,
      record,
      image
    },
  });
};

export const deleteRecord = async (id: string) => {
  return prisma.healthRecord.delete({
    where: { id },
  });
};
