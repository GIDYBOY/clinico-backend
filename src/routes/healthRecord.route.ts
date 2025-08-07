import { Router } from "express";
import * as RecordController from "../controllers/healthRecord.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { requireRole, requireRoles } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

// PATIENT: view own records
router.get("/me", requireRole("PATIENT"), RecordController.getMyRecords);

// DOCTOR/ADMIN: view a patient's records
router.get(
  "/patient/:id",
  requireRoles(["DOCTOR", "ADMIN"]),
  RecordController.getPatientRecords
);
router.get("/download/:fileName", authenticate, RecordController.downloadRecord)
// DOCTOR/ADMIN: create a record
router.post("/create", requireRoles(["PATIENT"]), upload.single("file"), RecordController.create);

// ADMIN: delete a record
router.delete(
  "/:id",
  requireRole("ADMIN"),
  RecordController.remove
);

export default router;
