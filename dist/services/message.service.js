"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.toggleReadStatus = exports.markAsRead = exports.getInbox = exports.sendMessageFromAdmin = exports.sendMessage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    omit: {
        user: {
            password: true,
        },
    },
});
const sendMessage = async (senderId, receiverId, subject, content) => {
    return prisma.message.create({
        data: { senderId, receiverId, subject, content },
    });
};
exports.sendMessage = sendMessage;
const sendMessageFromAdmin = async (receiverId, subject, content) => {
    // Assuming admin messages are sent from a specific admin user
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    });
    if (!admin) {
        throw new Error("No admin user found");
    }
    return prisma.message.create({
        data: { senderId: admin.id, receiverId, subject, content },
    });
};
exports.sendMessageFromAdmin = sendMessageFromAdmin;
const getInbox = async (userId) => {
    return prisma.message.findMany({
        where: { receiverId: userId },
        orderBy: { createdAt: "desc" },
        include: { sender: true, receiver: true },
    });
};
exports.getInbox = getInbox;
const markAsRead = async (messageId) => {
    return prisma.message.update({
        where: { id: messageId },
        data: { read: true },
    });
};
exports.markAsRead = markAsRead;
const toggleReadStatus = async (messageId, read) => {
    return prisma.message.update({
        where: { id: messageId },
        data: { read },
    });
};
exports.toggleReadStatus = toggleReadStatus;
const deleteMessage = async (messageId) => {
    return prisma.message.delete({
        where: { id: messageId },
    });
};
exports.deleteMessage = deleteMessage;
