import express, { Router } from "express";
import { webhookHandler, createCheckoutSession } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

router.post("/create-checkout-session", authenticate, createCheckoutSession);

export default router;
