"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const client_1 = require("@prisma/client");
const appointmentReminder_job_1 = require("./jobs/appointmentReminder.job");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir);
// Load env variables
dotenv_1.default.config();
// Express app
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const corsOptions = {
    origin: "https://silly-belekoy-f5c3ab.netlify.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow sending cookies and HTTP authentication
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/v1", routes_1.default);
// Root route
app.get("/", (_req, res) => {
    res.send("Clinico API active! \n");
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res
        .status(500)
        .json({ error: "Something went wrong", detail: err.message });
});
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
(0, appointmentReminder_job_1.startAppointmentReminderJob)();
