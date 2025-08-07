import { Router } from "express";
import * as InvoiceController from "../controllers/invoice.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

// PATIENT: view their invoices
router.get("/me", requireRole("PATIENT"), InvoiceController.getMine);

// ADMIN: full control
router.get("/", requireRole("ADMIN"), InvoiceController.getAll);
// router.post("/", requireRole("ADMIN"), InvoiceController.create);
router.put(
  "/:id/mark-paid",
  requireRole("ADMIN"),
  InvoiceController.markAsPaid
);
router.put("/:id/pay", requireRole("PATIENT"), InvoiceController.pay);

router.delete("/:id", requireRole("ADMIN"), InvoiceController.remove);

export default router;
