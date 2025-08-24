import { Router } from "express";
import * as AppointmentController from "../controllers/appointments.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRoles, requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

// Book appointment (PATIENT only)
router.post("/create", requireRole("PATIENT"), AppointmentController.create);

// View own appointments (PATIENT / DOCTOR)
router.get("/mine", AppointmentController.getMine);

router.get("/available/:doctorId", AppointmentController.checkAvailability);

// Admin: view and manage all
router.get("/", requireRole("ADMIN"), AppointmentController.getAll);
router.patch(
  "/:id/status",
  requireRoles(["ADMIN", "DOCTOR"]),
  AppointmentController.updateStatus
);
router.put("/:id/reschedule", AppointmentController.reschedule);
router.delete("/:id", requireRole("ADMIN"), AppointmentController.remove);

export default router;
