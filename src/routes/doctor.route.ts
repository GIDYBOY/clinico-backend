import { Router } from "express";
import * as DoctorController from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// Admin: view all doctors
router.get("/", authenticate, requireRole("ADMIN"), DoctorController.getAll);

// Self access
router.get("/me", authenticate, requireRole("DOCTOR"), DoctorController.getOne);

router.get("/department/:dept", authenticate, DoctorController.getDoctorsByDepartment);
router.get("/:id", authenticate, DoctorController.getDocByUserId )

router.post("/register", DoctorController.registerDoctor);

router.put(
  "/me",
  authenticate,
  requireRole("DOCTOR"),
  DoctorController.updateProfile
);

// Admin-only delete
router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  DoctorController.remove
);

export default router;
