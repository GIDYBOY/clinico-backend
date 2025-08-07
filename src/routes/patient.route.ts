import { Router } from "express";
import * as PatientController from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware"; // We'll define this below

const router = Router();

// Admin route — view all patients
router.get("/", authenticate, requireRole("ADMIN"), PatientController.getAll);

// Self route — view/update own profile
router.get("/me", authenticate, PatientController.getMe);
router.get("/:id", authenticate, PatientController.getOne);
router.put("/me", authenticate, PatientController.updateProfile);

// Admin-only delete
router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  PatientController.remove
);
router.post("/register", PatientController.registerPatient);

export default router;
