"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.pay = exports.markAsPaid = exports.getAll = exports.getMine = void 0;
const InvoiceService = __importStar(require("../services/invoice.service"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// export const create = async (req: Request, res: Response) => {
//   const { patientId, amount, status } = req.body;
//   if (!patientId || !amount || !status) {
//     res.status(400).json({ error: "Missing patientId, amount, or status" });
//     return;
//   }
//   const invoice = await InvoiceService.createInvoice(patientId, amount, status);
//   res.status(201).json(invoice);
// };
const getMine = async (req, res) => {
    const patientId = req.user?.id;
    if (!patientId) {
        res.status(400).json({ error: "Patient record not found" });
        return;
    }
    const invoices = await InvoiceService.getInvoicesForPatient(patientId);
    res.json(invoices);
};
exports.getMine = getMine;
const getAll = async (_req, res) => {
    const invoices = await InvoiceService.getAllInvoices();
    res.json(invoices);
};
exports.getAll = getAll;
const markAsPaid = async (req, res) => {
    const { id } = req.params;
    const invoice = await InvoiceService.markInvoiceAsPaid(id);
    res.json(invoice);
};
exports.markAsPaid = markAsPaid;
const pay = async (req, res) => {
    const { id } = req.params;
    const { reference } = req.body;
    if (!reference) {
        res.status(400).json({ error: "Payment reference required" });
        return;
    }
    const result = await InvoiceService.payInvoice(id, reference);
    res.json(result);
};
exports.pay = pay;
const remove = async (req, res) => {
    const { id } = req.params;
    await InvoiceService.deleteInvoice(id);
    res.status(204).send();
};
exports.remove = remove;
