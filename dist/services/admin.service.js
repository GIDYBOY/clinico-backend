"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.deleteUser = exports.updateUserRole = exports.getUserById = exports.generateAccessCode = exports.getAllUsers = exports.createAdmin = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient({
    omit: {
        user: {
            password: true,
        },
    },
});
const createAdmin = async (data) => {
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
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
exports.createAdmin = createAdmin;
const getAllUsers = async () => {
    return prisma.user.findMany({
        include: {
            doctor: true,
            patient: true,
        },
    });
};
exports.getAllUsers = getAllUsers;
const generateAccessCode = async (adminId) => {
    const code = crypto.randomUUID();
    await prisma.accessCode.create({
        data: {
            code,
            createdById: adminId,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    });
    return code;
};
exports.generateAccessCode = generateAccessCode;
const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        include: {
            doctor: true,
            patient: true,
        },
    });
};
exports.getUserById = getUserById;
const updateUserRole = async (id, role) => {
    return prisma.user.update({
        where: { id },
        data: { role },
    });
};
exports.updateUserRole = updateUserRole;
const deleteUser = async (id) => {
    return prisma.user.delete({
        where: { id },
    });
};
exports.deleteUser = deleteUser;
const getDashboardStats = async () => {
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
exports.getDashboardStats = getDashboardStats;
