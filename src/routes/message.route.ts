import { Router } from "express";
import * as MessageController from "../controllers/message.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/send", MessageController.send);
router.get("/inbox", MessageController.inbox);
router.put("/:id/read", MessageController.read);
router.put("/:id/toggle-read", MessageController.toggleRead);

router.delete("/:id", MessageController.deleteMessage);
export default router;
