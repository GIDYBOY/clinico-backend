"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatientProfile = exports.getPatientByUserId = exports.getPatientById = exports.getAllPatients = exports.createPatient = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient({
    omit: {
        user: {
            password: true,
        },
    },
});
const createPatient = async (data) => {
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
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
exports.createPatient = createPatient;
const getAllPatients = async () => {
    return prisma.patient.findMany({
        include: {
            user: true,
            appointments: true,
            invoices: true,
            healthRecords: true,
        },
    });
};
exports.getAllPatients = getAllPatients;
const getPatientById = async (id) => {
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
exports.getPatientById = getPatientById;
const getPatientByUserId = async (userId) => {
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
exports.getPatientByUserId = getPatientByUserId;
const updatePatientProfile = async (userId, data) => {
    return prisma.user.update({
        where: { id: userId },
        data,
    });
};
exports.updatePatientProfile = updatePatientProfile;
const deletePatient = async (id) => {
    return prisma.patient.delete({
        where: { id },
    });
};
exports.deletePatient = deletePatient;
