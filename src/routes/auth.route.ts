import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {upload} from "../middlewares/upload.middleware"

const router = Router();

// router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", authenticate, AuthController.me);
// router.put("/me", authenticate, upload.single("image"), AuthController.me)

export default router;
