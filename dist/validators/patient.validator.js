"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePatientSchema = void 0;
const zod_1 = require("zod");
exports.CreatePatientSchema = zod_1.z.object({
    name: zod_1.z.string(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    gender: zod_1.z.string(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.string().datetime().optional(),
    bloodGroup: zod_1.z.string().optional(),
    allergies: zod_1.z.array(zod_1.z.string()),
    currentMedications: zod_1.z.string().optional(),
    existingConditions: zod_1.z.string().optional(),
    emergencyContactName: zod_1.z.string().optional(),
    emergencyContactPhone: zod_1.z.string().optional(),
    emergencyContactLocation: zod_1.z.string().optional(),
    emergencyContactRelationship: zod_1.z.string().optional(),
    primaryPhysician: zod_1.z.string().optional(),
});
