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
const express_1 = require("express");
const PatientController = __importStar(require("../controllers/patient.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware"); // We'll define this below
const router = (0, express_1.Router)();
// Admin route — view all patients
router.get("/", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("ADMIN"), PatientController.getAll);
// Self route — view/update own profile
router.get("/me", auth_middleware_1.authenticate, PatientController.getMe);
router.get("/:id", auth_middleware_1.authenticate, PatientController.getOne);
router.put("/me", auth_middleware_1.authenticate, PatientController.updateProfile);
// Admin-only delete
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)("ADMIN"), PatientController.remove);
router.post("/register", PatientController.registerPatient);
exports.default = router;
