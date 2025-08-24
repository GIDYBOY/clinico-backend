import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from "../types/user";

const prisma = new PrismaClient();

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cookie = req.cookies
  if (!cookie.biscuit) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { userId } = verifyToken(cookie.biscuit);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user?.image ?? "/images/profile.png"
    };
    next(); // move on to next middleware/controller
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const authorize = (roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !roles.includes(req?.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
};