import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {upload} from "../middlewares/upload.middleware"

const router = Router();

router.post("/login", AuthController.login);
router.get("/me", authenticate, AuthController.me);
//forgot password route
router.post("/forgot-password", AuthController.forgotPassword)
// router.put("/me", authenticate, upload.single("image"), AuthController.me)

export default router;
