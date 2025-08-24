"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.updateTicketStatus = exports.getAllTickets = exports.getUserTickets = exports.getTicketById = exports.createTicket = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTicket = async (userId, data) => {
    const ticket = await prisma.ticket.create({
        data: {
            senderId: userId,
            subject: data.subject,
            message: data.message,
            category: data.category,
            priority: data.priority,
            status: "OPEN",
        },
    });
    // Send initial message to ADMIN from user
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (admin) {
        await prisma.message.create({
            data: {
                senderId: userId,
                receiverId: admin.id,
                content: data.message,
                subject: ticket.id,
            },
        });
    }
    return ticket;
};
exports.createTicket = createTicket;
const getTicketById = (ticketId) => prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { user: true },
});
exports.getTicketById = getTicketById;
const getUserTickets = (userId) => prisma.ticket.findMany({
    where: { senderId: userId },
    include: { user: true },
});
exports.getUserTickets = getUserTickets;
const getAllTickets = () => prisma.ticket.findMany({ include: { user: true } });
exports.getAllTickets = getAllTickets;
const updateTicketStatus = (ticketId, status) => prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
});
exports.updateTicketStatus = updateTicketStatus;
const deleteTicket = (ticketId) => prisma.ticket.delete({
    where: { id: ticketId },
});
exports.deleteTicket = deleteTicket;
