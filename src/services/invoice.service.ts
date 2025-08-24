import { PrismaClient, } from '@prisma/client';

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

// export const createInvoice = async (
//   patientId: string,
//   amount: number,
//   status: "UNPAID" | "PAID"
// ) => {
//   return prisma.invoice.create({
//     data: {
//       patientId,

//       amount,
//       status,
//     },
//   });
// };

export const getInvoicesForPatient = async (patientId: string) => {
  return prisma.invoice.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllInvoices = async () => {
  return prisma.invoice.findMany({
    include: {
      patient: { include: { user: true } },
      appointment: true
    },
    orderBy: { createdAt: "desc" },
  });
};

export const markInvoiceAsPaid = async (id: string) => {
  return prisma.invoice.update({
    where: { id },
    data: { status: "PAID" },
  });
};

export const payInvoice = async (id: string, reference: string) => {
  return prisma.invoice.update({
    where: { id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      reference,
    },
  });
};
  

export const deleteInvoice = async (id: string) => {
  return prisma.invoice.delete({ where: { id } });
};
