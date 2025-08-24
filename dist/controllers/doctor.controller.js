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
exports.remove = exports.updateProfile = exports.registerDoctor = exports.getDoctorsByDepartment = exports.getDocByUserId = exports.getOne = exports.getAll = void 0;
const DoctorService = __importStar(require("../services/doctor.service"));
const doctor_validator_1 = require("../validators/doctor.validator");
const getAll = async (_req, res) => {
    const doctors = await DoctorService.getAllDoctors();
    res.json(doctors);
};
exports.getAll = getAll;
const getOne = async (req, res) => {
    const doctor = await DoctorService.getDoctorById(req.params.id);
    if (!doctor) {
        res.status(404).json({ error: "Doctor not found" });
        return;
    }
    res.json(doctor);
};
exports.getOne = getOne;
const getDocByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await DoctorService.getDoctorByUserId(id);
        if (!doctor) {
            res.status(404).json({ error: "Doctor not found" });
            return;
        }
        res.json(doctor);
    }
    catch {
        res.status(500);
    }
};
exports.getDocByUserId = getDocByUserId;
const getDoctorsByDepartment = async (req, res) => {
    const { dept } = req.params;
    try {
        const doctors = await DoctorService.getDoctorsByDepartment(dept);
        if (!doctors) {
            res.status(404).json({ error: "No doctors in department" });
            return;
        }
        res.json(doctors);
    }
    catch (error) {
        res.status(500).json({ error: "Internal error" });
    }
};
exports.getDoctorsByDepartment = getDoctorsByDepartment;
const registerDoctor = async (req, res) => {
    const result = doctor_validator_1.CreateDoctorSchema.safeParse(req.body);
    console.log("Validation result:", result.error);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    try {
        const user = await DoctorService.createDoctor(result.data);
        res.status(201).json({ message: "Doctor created", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create doctor" });
    }
};
exports.registerDoctor = registerDoctor;
const updateProfile = async (req, res) => {
    const userId = req.user?.id;
    const updated = await DoctorService.updateDoctorProfile(userId, req.body);
    res.json(updated);
};
exports.updateProfile = updateProfile;
const remove = async (req, res) => {
    const { id } = req.params;
    await DoctorService.deleteDoctor(id);
    res.status(204).send();
};
exports.remove = remove;
