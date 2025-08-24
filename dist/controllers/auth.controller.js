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
exports.forgotPassword = exports.me = exports.login = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const login = async (req, res) => {
    try {
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
        const { password, ...payload } = user;
        res.status(200).json(payload);
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Internal error, retry!" });
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        res.json(req.user);
        return;
    }
    catch (err) {
        console.error("Error fetching user in /me route:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.me = me;
const forgotPassword = async (req, res) => {
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
        }
        else {
            res.status(400).json({ error: result.error });
            return;
        }
    }
    catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.forgotPassword = forgotPassword;
