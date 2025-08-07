import { Request, Response, NextFunction } from "express";

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
    createdAt: Date;
}

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "DOCTOR" | "PATIENT";
    image?: string;
  };
};