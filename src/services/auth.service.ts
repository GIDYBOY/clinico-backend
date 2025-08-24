import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const login = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken({ userId: user.id });
  return { user, token };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: false, error: 'User not found' };

  // Here we should send an email with a reset link
  return { success: true };
};