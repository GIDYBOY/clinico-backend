"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticate = async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie.biscuit) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const { userId } = (0, jwt_1.verifyToken)(cookie.biscuit);
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
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req?.user.role)) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
