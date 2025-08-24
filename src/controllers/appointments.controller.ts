import { Request, Response } from "express";
import * as AppointmentService from "../services/appointments.service";
import { AuthenticatedRequest } from "../types/user";


export const create = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
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

  const isAvailable = await AppointmentService.isTimeSlotAvailable(
    doctorId,
    new Date(date)
  );
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

export const checkAvailability = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { date } = req.query;
  if (!date) {
    res.status(400).json({ error: "Date is required" });
    return;
  }
  const available = await AppointmentService.isTimeSlotAvailable(
    doctorId,
    new Date(date as string)
  );
  res.json({ available });
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["SCHEDULED", "CANCELLED", "COMPLETED"].includes(status)) {
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
