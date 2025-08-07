import { Router } from "express";
import * as TicketController from "../controllers/ticket.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/create", TicketController.create);
router.get("/me", TicketController.userTickets);
router.get("/all",  requireRole("ADMIN"), TicketController.allTickets);
router.patch("/:ticketId/status", requireRole("ADMIN"), TicketController.updateStatus);

export default router;
