"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDoctorProfileSchema = exports.CreateDoctorSchema = void 0;
const zod_1 = require("zod");
exports.CreateDoctorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    username: zod_1.z.string().min(1, "Username is required"),
    email: zod_1.z.string().email("Invalid email"),
    gender: zod_1.z.string().min(1, "Gender is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    phone: zod_1.z.string(),
    address: zod_1.z.string(),
    dateOfBirth: zod_1.z.string().datetime(),
    accessCode: zod_1.z.string().optional(), // Optional access code for registration
    image: zod_1.z.string().url().optional(), // Optional profile image URL
    specialization: zod_1.z.string().min(1, "Specialization is required"),
    department: zod_1.z
        .enum([
        "PRIMARY_CARE",
        "CHILDREN_HEALTH",
        "MEDICAL_SPECIALTIES",
        "MENTAL_HEALTH",
        "DENTAL_CARE",
    ]),
    education: zod_1.z.string().optional(),
    certifications: zod_1.z.string().optional(),
    yearsOfExperience: zod_1.z.coerce.number().optional(),
    medicalLicenseNumber: zod_1.z.string().optional(),
});
exports.UpdateDoctorProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    image: zod_1.z.string().url().optional(),
    specialization: zod_1.z.string().optional(),
    department: zod_1.z
        .enum([
        "PRIMARY_CARE",
        "CHILDREN_HEALTH",
        "MEDICAL_SPECIALTIES",
        "MENTAL_HEALTH",
        "DENTAL_CARE",
    ])
        .optional(),
});
