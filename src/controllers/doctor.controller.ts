import { Request, Response } from "express";
import * as DoctorService from "../services/doctor.service";
import { AuthenticatedRequest } from "../types/user";
import { CreateDoctorSchema } from "../validators/doctor.validator";


export const getAll = async (_req: Request, res: Response) => {
  const doctors = await DoctorService.getAllDoctors();
  res.json(doctors);
};

export const getOne = async (req: Request, res: Response) => {
  const doctor = await DoctorService.getDoctorById(req.params.id);
  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }
  res.json(doctor);
};

export const getDocByUserId = async (req: Request, res: Response) => {
  try{
    const {id} = req.params
    const doctor = await DoctorService.getDoctorByUserId(id)
    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }
    res.json(doctor);

  } catch {
    res.status(500)
  }
}

export const getDoctorsByDepartment = async (req: Request, res: Response) => {
  const {dept} = req.params
  try {
    const doctors = await DoctorService.getDoctorsByDepartment(dept);
    if (!doctors) {
      res.status(404).json({error: "No doctors in department"})
      return
    }
    res.json(doctors)
  } catch (error) {
    res.status(500).json({error: "Internal error"})
  }
}

export const registerDoctor = async (req: Request, res: Response) => {
  const result = CreateDoctorSchema.safeParse(req.body);
  console.log("Validation result:", result.error);

  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  try {
    const user = await DoctorService.createDoctor(result.data);
    res.status(201).json({ message: "Doctor created", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create doctor" });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id!;
  const updated = await DoctorService.updateDoctorProfile(userId, req.body);
  res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await DoctorService.deleteDoctor(id);
  res.status(204).send();
};

