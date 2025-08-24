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
exports.remove = exports.updateProfile = exports.getOne = exports.getMe = exports.getAll = exports.registerPatient = void 0;
const PatientService = __importStar(require("../services/patient.service"));
const patient_validator_1 = require("../validators/patient.validator");
const registerPatient = async (req, res) => {
    const result = patient_validator_1.CreatePatientSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    try {
        const user = await PatientService.createPatient(result.data);
        res.status(201).json({ message: "Patient created", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create patient" });
    }
};
exports.registerPatient = registerPatient;
const getAll = async (_req, res) => {
    const patients = await PatientService.getAllPatients();
    res.json(patients);
};
exports.getAll = getAll;
const getMe = async (req, res) => {
    const userId = req.user?.id;
    const patient = await PatientService.getPatientByUserId(userId);
    if (!patient) {
        res.status(404).json({ error: "Patient does not exist" });
        return;
    }
    res.json(patient);
};
exports.getMe = getMe;
const getOne = async (req, res) => {
    const patient = await PatientService.getPatientById(req.params.id);
    if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
    }
    res.json(patient);
};
exports.getOne = getOne;
const updateProfile = async (req, res) => {
    const userId = req.user?.id;
    const updated = await PatientService.updatePatientProfile(userId, req.body);
    res.json(updated);
};
exports.updateProfile = updateProfile;
const remove = async (req, res) => {
    const { id } = req.params;
    await PatientService.deletePatient(id);
    res.status(204).send();
};
exports.remove = remove;
// export const getPatientAppointments = async (req: Request, res: Response) => {
//   const patientId = req.params.id;
//   const appointments = await PatientService.getPatientAppointments(patientId);
//   res.json(appointments);
// };
// export const getPatientInvoices = async (req: Request, res: Response) => {
//   const patientId = req.params.id;
//   const invoices = await PatientService.getPatientInvoices(patientId);
//   res.json(invoices);
// };
// export const getPatientHealthRecords = async (req: Request, res: Response) => {
//   const patientId = req.params.id;
//   const healthRecords = await PatientService.getPatientHealthRecords(patientId);
//   res.json(healthRecords);
// };
// export const getPatientByEmail = async (req: Request, res: Response) => {
//   const email = req.params.email;
//   const patient = await PatientService.getPatientByEmail(email);
//   if (!patient) return res.status(404).json({ error: "Patient not found" });
//   res.json(patient);
// };
