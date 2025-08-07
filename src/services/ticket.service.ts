import { PrismaClient } from "../generated/prisma";
import { CreateTicketDTO } from "../validators/ticket.validator"
import { TicketStatus } from '../generated/prisma/index.d';

const prisma = new PrismaClient();

export const createTicket = async (userId: string, data: CreateTicketDTO) => {
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

export const getUserTickets = (userId: string) =>
  prisma.ticket.findMany({
    where: { senderId: userId },
    include: { user: true },
  });

export const getAllTickets = () =>
  prisma.ticket.findMany({ include: { user: true } });

export const updateTicketStatus = (ticketId: string, status: TicketStatus) =>
  prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });
