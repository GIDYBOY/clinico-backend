import { PrismaClient, Role } from '../generated/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

// export const register = async (data: {
//   name: string;
//   email: string;
//   password: string;
//   role: Role;
//   image?: string;
//   specialization?: string;
//   department?: string;
// }) => {
//   const existing = await prisma.user.findUnique({ where: { email: data.email } });
//   if (existing) throw new Error('Email already in use');

//   const hashed = await hashPassword(data.password);
//   const user = await prisma.user.create({
//     data: {
//       name: data.name,
//       email: data.email,
//       password: hashed,
//       role: data.role,
//       image: data.image,
//     }
//   });

//   if (data.role === 'DOCTOR') {
//     await prisma.doctor.create({
//       data: {
//         userId: user.id,
//         specialization: data.specialization!,
//         department: data.department!,
//       }
//     });
//   } else if (data.role === 'PATIENT') {
//     await prisma.patient.create({
//       data: {
//         userId: user.id
//       }
//     });
//   }

//   const token = generateToken({ userId: user.id });
//   return { user, token };
// };

export const login = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken({ userId: user.id });
  return { user, token };
};
