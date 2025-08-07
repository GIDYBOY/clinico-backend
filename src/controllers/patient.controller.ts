import { Request, Response } from "express";
import * as PatientService from "../services/patient.service";
import { CreatePatientSchema } from "../validators/patient.validator";
import { AuthenticatedRequest } from "../types/user";


export const registerPatient = async (req: Request, res: Response) => {
  const result = CreatePatientSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  try {
    const user = await PatientService.createPatient(result.data);
    res.status(201).json({ message: "Patient created", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create patient" });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const patients = await PatientService.getAllPatients();
  res.json(patients);
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id!;
  const patient = await PatientService.getPatientByUserId(userId);
  if (!patient) {
    res.status(404).json({ error: "Patient does not exist" });
    return;
  }
  res.json(patient);
};

export const getOne = async (req: Request, res: Response) => {
  const patient = await PatientService.getPatientById(req.params.id);
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(patient);
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id!;
  const updated = await PatientService.updatePatientProfile(userId, req.body);
  res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await PatientService.deletePatient(id);
  res.status(204).send();
};


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

