import express, {Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { PrismaClient } from "./generated/prisma";
import { startAppointmentReminderJob } from "./jobs/appointmentReminder.job";
import { startOverdueInvoiceJob } from "./jobs/overdueInvoices.job";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// Load env variables
dotenv.config();

// Express app
const app = express();
const prisma = new PrismaClient();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow sending cookies and HTTP authentication
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/v1", routes);

// Root route
app.get("/", (_req, res) => {
  res.send("Clinico API active! \n");
});

// Global error handler
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error(err);
    res
    .status(500)
    .json({ error: "Something went wrong", detail: err.message });
}
);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

startAppointmentReminderJob();