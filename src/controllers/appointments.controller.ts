import { Request, Response } from "express";
import * as AppointmentService from "../services/appointments.service";
import { AuthenticatedRequest } from "../types/user";


export const create = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role !== "PATIENT") {
    res.status(403).json({ error: "Only patients can book appointments" });
    return;
  }
  const patientId = user?.id;
  if (!patientId) {
    res.status(400).json({ error: "Patient record not found" });
    return;
  }

  const { doctorId, date, note } = req.body;
  const appointment = await AppointmentService.createAppointmentWithInvoice({
    patientId,
    doctorId,
    date,
    note,
  });

  if(!appointment) res.status(400).json({error: "Failed to create appointment"})

  res.status(201).json(appointment);
};

export const getMine = async (req: AuthenticatedRequest, res: Response) => {
  const appointments = await AppointmentService.getAppointmentsForUser(
    req.user!.id,
    req.user!.role
  );
  res.json(appointments);
};

export const getAll = async (_req: Request, res: Response) => {
  const appointments = await AppointmentService.getAllAppointments();
  res.json(appointments);
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["scheduled", "cancelled", "completed"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const updated = await AppointmentService.updateAppointmentStatus(id, status);
  res.json(updated);
};

export const reschedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date } = req.body;

  if (!date) {
    res.status(400).json({ error: "New date is required" });
    return;
  }

  try {
    const updated = await AppointmentService.rescheduleAppointment(
      id,
      new Date(date)
    );
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


export const remove = async (req: Request, res: Response) => {
  await AppointmentService.deleteAppointment(req.params.id);
  res.status(204).send();
};
