"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.login = void 0;
const client_1 = require("@prisma/client");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const login = async (data) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user)
        throw new Error('Invalid credentials');
    const valid = await (0, hash_1.comparePassword)(data.password, user.password);
    if (!valid)
        throw new Error('Invalid credentials');
    const token = (0, jwt_1.generateToken)({ userId: user.id });
    return { user, token };
};
exports.login = login;
const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return { success: false, error: 'User not found' };
    // Here we should send an email with a reset link
    return { success: true };
};
exports.forgotPassword = forgotPassword;
