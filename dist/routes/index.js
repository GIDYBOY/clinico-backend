"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const patient_route_1 = __importDefault(require("./patient.route"));
const doctor_route_1 = __importDefault(require("./doctor.route"));
const admin_route_1 = __importDefault(require("./admin.route"));
const appointments_route_1 = __importDefault(require("./appointments.route"));
const healthRecord_route_1 = __importDefault(require("./healthRecord.route"));
const invoice_route_1 = __importDefault(require("./invoice.route"));
const message_route_1 = __importDefault(require("./message.route"));
const payment_route_1 = __importDefault(require("./payment.route"));
const ticket_route_1 = __importDefault(require("./ticket.route"));
const router = (0, express_1.Router)();
// All route modules go here
router.use("/auth", auth_route_1.default);
router.use("/patients", patient_route_1.default);
router.use("/doctors", doctor_route_1.default);
router.use("/admin", admin_route_1.default);
router.use("/appointments", appointments_route_1.default);
router.use("/records", healthRecord_route_1.default);
router.use("/invoices", invoice_route_1.default);
router.use("/messages", message_route_1.default);
router.use("/ticket", ticket_route_1.default);
router.use("/payment", payment_route_1.default);
exports.default = router;
