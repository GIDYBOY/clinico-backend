import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  subject: string,
  content: string
) => {
  return prisma.message.create({
    data: { senderId, receiverId, subject, content },
  });
};

export const getInbox = async (userId: string) => {
  return prisma.message.findMany({
    where: { receiverId: userId },
    orderBy: { createdAt: "desc" },
    include: { sender: true, receiver: true },
  });
};

export const markAsRead = async (messageId: string) => {
  return prisma.message.update({
    where: { id: messageId },
    data: { read: true },
  });
};

export const toggleReadStatus = async (
  messageId: string,
  read: boolean
) => {
  return prisma.message.update({
    where: { id: messageId },
    data: { read },
  });
};

export const deleteMessage = async (messageId: string) => {
  return prisma.message.delete({
    where: { id: messageId },
  });
};