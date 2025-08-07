import { Request, Response } from "express";
import * as MessageService from "../services/message.service";
import { AuthenticatedRequest } from "../types/user";

export const send = async (req: AuthenticatedRequest, res: Response) => {
  const senderId = req.user?.id;
  const { receiverId, subject, content } = req.body;
  if (!senderId) {
    res.status(401).json({ error: "Unauthorized: sender not found" });
    return;
  }

  if (!receiverId || !content) {
    res.status(400).json({ error: "receiverId and content are required" });
    return;
  }

  const message = await MessageService.sendMessage(
    senderId,
    receiverId,
    subject,
    content
  );
  res.status(201).json(message);
};

export const inbox = async (req: AuthenticatedRequest, res: Response) => {
  const inbox = await MessageService.getInbox(req.user!.id);
  res.json(inbox);
};

export const read = async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await MessageService.markAsRead(id);
  res.json(message);
};

export const toggleRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { read } = req.body;

  if (typeof read !== "boolean") {
    res.status(400).json({ error: "read must be true or false" });
    return;
  }

  const updated = await MessageService.toggleReadStatus(id, read);
  if (!updated) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  res.json(updated);
};


export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await MessageService.deleteMessage(id);
  if (!deleted) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.status(204).send();
};