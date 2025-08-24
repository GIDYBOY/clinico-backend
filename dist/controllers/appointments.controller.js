"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.reschedule = exports.updateStatus = exports.checkAvailability = exports.getAll = exports.getMine = exports.create = void 0;
const AppointmentService = __importStar(require("../services/appointments.service"));
const create = async (req, res) => {
    const user = req.user;
    if (user.role !== "PATIENT") {
        res
            .status(403)
            .json({ error: "Only patients can book appointments" });
        return;
    }
    const patientId = user.id;
    if (!patientId) {
        res.status(400).json({ error: "Patient record not found" });
        return;
    }
    const { doctorId, date, note } = req.body;
    const isAvailable = await AppointmentService.isTimeSlotAvailable(doctorId, new Date(date));
    if (!isAvailable) {
        res.status(409).json({ error: "Selected time is already booked" });
        return;
    }
    const appointment = await AppointmentService.createAppointmentWithInvoice({
        patientId,
        doctorId,
        date,
        note,
    });
    if (!appointment) {
        res.status(400).json({ error: "Failed to create appointment" });
        return;
    }
    res.status(201).json(appointment);
};
exports.create = create;
const getMine = async (req, res) => {
    const appointments = await AppointmentService.getAppointmentsForUser(req.user.id, req.user.role);
    res.json(appointments);
};
exports.getMine = getMine;
const getAll = async (_req, res) => {
    const appointments = await AppointmentService.getAllAppointments();
    res.json(appointments);
};
exports.getAll = getAll;
const checkAvailability = async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;
    if (!date) {
        res.status(400).json({ error: "Date is required" });
        return;
    }
    const available = await AppointmentService.isTimeSlotAvailable(doctorId, new Date(date));
    res.json({ available });
};
exports.checkAvailability = checkAvailability;
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!["SCHEDULED", "CANCELLED", "COMPLETED"].includes(status)) {
        res.status(400).json({ error: "Invalid status" });
        return;
    }
    const updated = await AppointmentService.updateAppointmentStatus(id, status);
    res.json(updated);
};
exports.updateStatus = updateStatus;
const reschedule = async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    if (!date) {
        res.status(400).json({ error: "New date is required" });
        return;
    }
    try {
        const updated = await AppointmentService.rescheduleAppointment(id, new Date(date));
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.reschedule = reschedule;
const remove = async (req, res) => {
    await AppointmentService.deleteAppointment(req.params.id);
    res.status(204).send();
};
exports.remove = remove;
