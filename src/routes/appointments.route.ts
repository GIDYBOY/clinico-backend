import { Router } from "express";
import * as AppointmentController from "../controllers/appointments.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

// Book appointment (PATIENT only)
router.post("/create", requireRole("PATIENT"), AppointmentController.create);

// View own appointments (PATIENT / DOCTOR)
router.get("/mine", AppointmentController.getMine);

// Admin: view and manage all
router.get("/", requireRole("ADMIN"), AppointmentController.getAll);
router.put(
  "/:id/status",
  requireRole("ADMIN"),
  AppointmentController.updateStatus
);
router.put("/:id/reschedule", AppointmentController.reschedule);
router.delete("/:id", requireRole("ADMIN"), AppointmentController.remove);

export default router;
