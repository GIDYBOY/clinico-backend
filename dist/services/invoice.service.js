"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoice = exports.payInvoice = exports.markInvoiceAsPaid = exports.getAllInvoices = exports.getInvoicesForPatient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
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
const getInvoicesForPatient = async (patientId) => {
    return prisma.invoice.findMany({
        where: { patientId },
        orderBy: { createdAt: "desc" },
    });
};
exports.getInvoicesForPatient = getInvoicesForPatient;
const getAllInvoices = async () => {
    return prisma.invoice.findMany({
        include: {
            patient: { include: { user: true } },
            appointment: true
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllInvoices = getAllInvoices;
const markInvoiceAsPaid = async (id) => {
    return prisma.invoice.update({
        where: { id },
        data: { status: "PAID" },
    });
};
exports.markInvoiceAsPaid = markInvoiceAsPaid;
const payInvoice = async (id, reference) => {
    return prisma.invoice.update({
        where: { id },
        data: {
            status: "PAID",
            paidAt: new Date(),
            reference,
        },
    });
};
exports.payInvoice = payInvoice;
const deleteInvoice = async (id) => {
    return prisma.invoice.delete({ where: { id } });
};
exports.deleteInvoice = deleteInvoice;
