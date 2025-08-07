import { Router } from "express";
import authRoutes from "./auth.route";
import patientRoutes from "./patient.route";
import doctorRoutes from "./doctor.route";
import adminRoute from "./admin.route";
import appointmentRoutes from "./appointments.route";
import healthRecordRoutes from "./healthRecord.route";
import invoiceRoutes from "./invoice.route";
import messageRoutes from "./message.route";
import paymentRoutes from "./payment.route";
import ticketRoutes from "./ticket.route"


const router = Router();

// All route modules go here
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/admin", adminRoute);
router.use("/appointments", appointmentRoutes);
router.use("/records", healthRecordRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/messages", messageRoutes);
router.use("/ticket", ticketRoutes);

router.use("/payment", paymentRoutes);

export default router;
