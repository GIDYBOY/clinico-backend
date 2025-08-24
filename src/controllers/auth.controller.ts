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
      sameSite: "none",
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
    return;
  } catch (err) {
    console.error("Error fetching user in /me route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const result = await AuthService.forgotPassword(email);
    if (result.success) {
      res.status(200).json({ message: "Password reset link sent to your email" });
      return;
    } else {
      res.status(400).json({ error: result.error });
      return;
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}