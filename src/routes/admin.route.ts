import { Router } from "express";
import * as AdminController from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

import { getDashboardStats } from "../controllers/admin.controller";

const router = Router();

// Admin-only routes
// router.use(authenticate, requireRole("ADMIN"));

router.post("/create", AdminController.createAdmin);

router.get("/users", AdminController.getAllUsers);
router.get("/users/:id", AdminController.getUser);
router.get("/stats", getDashboardStats);
router.put("/users/:id/role", AdminController.updateRole);
router.post("/access-code", AdminController.generateAccessCode);
router.delete("/users/:id", AdminController.deleteUser);

export default router;
