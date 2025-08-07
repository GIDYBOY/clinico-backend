import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";


type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "DOCTOR" | "PATIENT";
    image: string;
  };
};


export const login = async (req: Request, res: Response) => {
  try{
    const { user, token } = await AuthService.login(req.body);
    
    if (!user || !token) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.cookie("biscuit", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });
    const {password, ...payload} = user
  
    res.status(200).json(payload);
  } catch (error){
    console.log("Error", error);
    res.status(500).json({message: "Internal error, retry!"})
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("Error fetching user in /me route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

