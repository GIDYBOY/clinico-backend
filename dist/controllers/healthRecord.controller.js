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
exports.remove = exports.getPatientRecords = exports.getMyRecords = exports.downloadRecord = exports.create = void 0;
const HealthRecordService = __importStar(require("../services/healthRecord.service"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const create = async (req, res) => {
    const { userId, record } = req.body;
    const patient = await prisma.patient.findFirst({
        where: { userId: userId }
    });
    if (!record || !patient) {
        res.status(400).json({ error: "Missing patientId or record text" });
        return;
    }
    const fileName = req.file?.filename;
    if (!record || !patient.id) {
        res.status(400).json({ error: "Missing patientId or record text" });
        return;
    }
    const newRecord = await HealthRecordService.createRecord(patient.id, record, fileName);
    res.status(201).json(newRecord);
};
exports.create = create;
const downloadRecord = async (req, res) => {
    const { fileName } = req.params;
    if (!fileName) {
        res.status(404).json({ error: "File not found" });
    }
    res.download(`./uploads/${fileName}`);
};
exports.downloadRecord = downloadRecord;
const getMyRecords = async (req, res) => {
    if (!req.user?.role || req.user.role !== "PATIENT") {
        res.status(401).json({ error: "Only patient can access record" });
    }
    const patient = await prisma.patient.findFirst({
        where: { userId: req.user?.id },
    });
    if (!patient) {
        res.status(400).json({ error: "Patient record not found" });
        return;
    }
    const records = await HealthRecordService.getRecordsForPatient(patient.id);
    res.json(records);
};
exports.getMyRecords = getMyRecords;
const getPatientRecords = async (req, res) => {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
    }
    const records = await HealthRecordService.getRecordsForPatient(id);
    res.json(records);
};
exports.getPatientRecords = getPatientRecords;
const remove = async (req, res) => {
    const { id } = req.params;
    await HealthRecordService.deleteRecord(id);
    res.status(204).send();
};
exports.remove = remove;
