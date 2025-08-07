import { z } from "zod";

export const CreateAdminSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.string(),
  email: z.string(),
  password: z.string().min(6),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CreateAdminDTO = z.infer<typeof CreateAdminSchema>;
