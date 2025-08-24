import { Request, Response } from "express";
import * as AdminService from "../services/admin.service";
import { Role } from '@prisma/client';
import {CreateAdminSchema} from "../validators/user.validator"
import { AuthenticatedRequest } from "../types/user";


export const createAdmin = async (req: Request, res: Response) => {
  const parsed = CreateAdminSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const newAdmin = await AdminService.createAdmin(parsed.data);
  res.status(201).json(newAdmin);
};

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await AdminService.getAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await AdminService.getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
};

export const generateAccessCode = async (req: AuthenticatedRequest, res: Response) => {
  const adminId = req.user?.id;
  if (!adminId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  
  try {
    const code = await AdminService.generateAccessCode(adminId);
    res.status(201).json({ message: "Access code generated successfully", code: code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate access code" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!Object.values(Role).includes(role)) {
    res.status(400).json({ error: "Invalid role" });
    return;
  }

  const updated = await AdminService.updateUserRole(id, role);
  res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await AdminService.deleteUser(id);
  res.status(204).send();
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  const stats = await AdminService.getDashboardStats();
  res.json(stats);
}