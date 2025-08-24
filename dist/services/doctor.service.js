"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctor = exports.updateDoctorProfile = exports.createDoctor = exports.getDoctorsByDepartment = exports.getDoctorByUserId = exports.getDoctorById = exports.getAllDoctors = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    omit: {
        user: {
            password: true,
        },
    },
});
const getAllDoctors = async () => {
    return prisma.doctor.findMany({
        include: {
            user: true,
            appointments: true,
        },
    });
};
exports.getAllDoctors = getAllDoctors;
const getDoctorById = async (id) => {
    return prisma.doctor.findUnique({
        where: { id },
        include: {
            user: true,
            appointments: true,
        },
    });
};
exports.getDoctorById = getDoctorById;
const getDoctorByUserId = async (userId) => {
    return prisma.doctor.findUnique({
        where: { userId },
        include: {
            user: true,
            appointments: true,
        },
    });
};
exports.getDoctorByUserId = getDoctorByUserId;
const getDoctorsByDepartment = async (department) => {
    // Validate department
    if (!Object.values(client_1.Departments).includes(department)) {
        throw new Error("Invalid department");
    }
    return prisma.doctor.findMany({
        where: { department: department },
        include: {
            user: true,
            appointments: true,
        },
    });
};
exports.getDoctorsByDepartment = getDoctorsByDepartment;
const createDoctor = async (data) => {
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    // Check access code validity
    // const accessCode = await prisma.accessCode.findFirst({
    //   where: {
    //     code: data.accessCode,
    //     expiresAt: {
    //       gte: new Date(), // Check if the code is still valid
    //     },
    //   },
    // });
    // if (!accessCode) {
    //   throw new Error("Invalid or expired access code");
    // }
    const user = await prisma.user.create({
        data: {
            name: data.name,
            username: data.username,
            email: data.email,
            password: hashedPassword,
            gender: data.gender,
            phone: data.phone,
            address: data.address,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            role: "DOCTOR",
            doctor: {
                create: {
                    specialization: data.specialization,
                    department: data.department,
                    education: data.education,
                    certifications: data.certifications,
                    yearsOfExperience: data.yearsOfExperience,
                    medicalLicenseNumber: data.medicalLicenseNumber,
                },
            }
        },
    });
};
exports.createDoctor = createDoctor;
const updateDoctorProfile = async (userId, data) => {
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            image: data.image,
        },
    });
    const doctor = await prisma.doctor.update({
        where: { userId },
        data: {
            specialization: data.specialization,
            department: data.department,
        },
    });
    return { user: updatedUser, doctor };
};
exports.updateDoctorProfile = updateDoctorProfile;
const deleteDoctor = async (id) => {
    return prisma.doctor.delete({
        where: { id },
    });
};
exports.deleteDoctor = deleteDoctor;
