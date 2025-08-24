"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPatient = exports.isDoctor = exports.isAdmin = exports.requireRoles = exports.requireRole = void 0;
const client_1 = require("@prisma/client");
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            res.status(403).json({ error: "Forbidden: insufficient role" });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ error: "Forbidden: insufficient role" });
            return;
        }
        next();
    };
};
exports.requireRoles = requireRoles;
exports.isAdmin = (0, exports.requireRole)(client_1.Role.ADMIN);
exports.isDoctor = (0, exports.requireRole)(client_1.Role.DOCTOR);
exports.isPatient = (0, exports.requireRole)(client_1.Role.PATIENT);
