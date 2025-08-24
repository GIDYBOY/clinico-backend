"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdminSchema = void 0;
const zod_1 = require("zod");
exports.CreateAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    username: zod_1.z.string().min(1),
    dateOfBirth: zod_1.z.string().datetime().optional(),
    gender: zod_1.z.string(),
    email: zod_1.z.string(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
