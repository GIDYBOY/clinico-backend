import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma";
import { AuthenticatedRequest } from "../types/user";


export const requireRole = (role: Role) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
        res.status(403).json({ error: "Forbidden: insufficient role" });
        return;
    }
    next();
  };
};

export const requireRoles = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: insufficient role" });
      return;
    }
    next();
  };
};
export const isAdmin = requireRole(Role.ADMIN);
export const isDoctor = requireRole(Role.DOCTOR);
export const isPatient = requireRole(Role.PATIENT);  