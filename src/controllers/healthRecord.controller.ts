import { Request, Response } from "express";
import * as HealthRecordService from "../services/healthRecord.service";
import { PrismaClient } from "../generated/prisma";
import { AuthenticatedRequest } from "../types/user";

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
  const { userId, record } = req.body;
  const patient = await prisma.patient.findFirst({
    where: {userId: userId}
  })

  if (!record || !patient) {
    res.status(400).json({ error: "Missing patientId or record text" });
    return
  }

  const fileName: string | undefined = req.file?.filename;

  if (!record || !patient.id) {
    res.status(400).json({ error: "Missing patientId or record text" });
    return;
  }

  const newRecord = await HealthRecordService.createRecord(patient.id, record, fileName);
  res.status(201).json(newRecord);
};

export const downloadRecord = async (req: Request, res: Response) => {
  const {fileName} = req.params
  if(!fileName) {
    res.status(404).json({error: "File not found"})
  }
  res.download(`./uploads/${fileName}`)
}

export const getMyRecords = async (req: AuthenticatedRequest, res: Response) => {
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

export const getPatientRecords = async (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  const records = await HealthRecordService.getRecordsForPatient(id);
  res.json(records);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await HealthRecordService.deleteRecord(id);
  res.status(204).send();
};
