"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.deleteUser = exports.updateRole = exports.generateAccessCode = exports.getUser = exports.getAllUsers = exports.createAdmin = void 0;
const AdminService = __importStar(require("../services/admin.service"));
const client_1 = require("@prisma/client");
const user_validator_1 = require("../validators/user.validator");
const createAdmin = async (req, res) => {
    const parsed = user_validator_1.CreateAdminSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const newAdmin = await AdminService.createAdmin(parsed.data);
    res.status(201).json(newAdmin);
};
exports.createAdmin = createAdmin;
const getAllUsers = async (_req, res) => {
    const users = await AdminService.getAllUsers();
    res.json(users);
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    const user = await AdminService.getUserById(req.params.id);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json(user);
};
exports.getUser = getUser;
const generateAccessCode = async (req, res) => {
    const adminId = req.user?.id;
    if (!adminId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const code = await AdminService.generateAccessCode(adminId);
        res.status(201).json({ message: "Access code generated successfully", code: code });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate access code" });
    }
};
exports.generateAccessCode = generateAccessCode;
const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!Object.values(client_1.Role).includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
    }
    const updated = await AdminService.updateUserRole(id, role);
    res.json(updated);
};
exports.updateRole = updateRole;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    await AdminService.deleteUser(id);
    res.status(204).send();
};
exports.deleteUser = deleteUser;
const getDashboardStats = async (_req, res) => {
    const stats = await AdminService.getDashboardStats();
    res.json(stats);
};
exports.getDashboardStats = getDashboardStats;
