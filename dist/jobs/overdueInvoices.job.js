"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOverdueInvoiceJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const message_service_1 = require("../services/message.service");
const prisma = new client_1.PrismaClient();
const startOverdueInvoiceJob = () => {
    // Run every day at 8AM
    node_cron_1.default.schedule("0 8 * * *", async () => {
        const now = new Date();
        const pastDue = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const overdue = await prisma.invoice.findMany({
            where: {
                status: "UNPAID",
                createdAt: {
                    lt: pastDue,
                },
            },
            include: {
                patient: { include: { user: true } },
            },
        });
        for (const invoice of overdue) {
            const user = invoice.patient.user;
            await (0, message_service_1.sendMessageFromAdmin)(user.id, "Overdue Invoice Reminder", `Reminder: Invoice of ₦${invoice.amount} from ${invoice.createdAt.toLocaleDateString()} is still unpaid. Please pay promptly.`);
        }
        console.log(`[Overdue Invoice Job] Sent ${overdue.length} reminders`);
    });
};
exports.startOverdueInvoiceJob = startOverdueInvoiceJob;
