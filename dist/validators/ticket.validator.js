"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTicketSchema = void 0;
const zod_1 = require("zod");
exports.CreateTicketSchema = zod_1.z.object({
    subject: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    message: zod_1.z.string().min(1),
});
