import { Request, Response } from "express";
import * as TicketService from "../services/ticket.service";
import { CreateTicketSchema } from "../validators/ticket.validator";
import { AuthenticatedRequest } from "../types/user";


export const create = async (req: AuthenticatedRequest, res: Response) => {
  const parse = CreateTicketSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }

  const ticket = await TicketService.createTicket(req.user!.id, parse.data);
  res.status(201).json(ticket);
};

export const getTicketById = async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  const ticket = await TicketService.getTicketById(ticketId);
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.status(200).json(ticket);
};

export const userTickets = async (req: AuthenticatedRequest, res: Response) => {
  const tickets = await TicketService.getUserTickets(req.user!.id);
  res.status(200).json(tickets);
};

export const allTickets = async (_req: Request, res: Response) => {
  const tickets = await TicketService.getAllTickets();
  res.status(200).json(tickets);
};

export const updateStatus = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  const ticket = await TicketService.updateTicketStatus(ticketId, status);
  res.status(200).json(ticket);
};


export const deleteTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  await TicketService.deleteTicket(ticketId);
  res.status(204).send();
};