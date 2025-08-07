import { Request, Response } from "express";
import * as InvoiceService from "../services/invoice.service";
import { PrismaClient } from "../generated/prisma";
import { AuthenticatedRequest } from "../types/user"; 

const prisma = new PrismaClient();

// export const create = async (req: Request, res: Response) => {
//   const { patientId, amount, status } = req.body;

//   if (!patientId || !amount || !status) {
//     res.status(400).json({ error: "Missing patientId, amount, or status" });
//     return;
//   }

//   const invoice = await InvoiceService.createInvoice(patientId, amount, status);
//   res.status(201).json(invoice);
// };

export const getMine = async (req: AuthenticatedRequest, res: Response) => {
  const patientId = req.user?.id;
  if (!patientId) {
    res.status(400).json({ error: "Patient record not found" });
    return;
  }

  const invoices = await InvoiceService.getInvoicesForPatient(patientId);
  res.json(invoices);
};

export const getAll = async (_req: Request, res: Response) => {
  const invoices = await InvoiceService.getAllInvoices();
  res.json(invoices);
};

export const markAsPaid = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = await InvoiceService.markInvoiceAsPaid(id);
  res.json(invoice);
};

export const pay = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reference } = req.body;

  if (!reference) {
    res.status(400).json({ error: "Payment reference required" });
    return;
  }

  const result = await InvoiceService.payInvoice(id, reference);
  res.json(result);
};
  

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await InvoiceService.deleteInvoice(id);
  res.status(204).send();
};
