import { z } from "zod";

export const CreatePatientSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  gender: z.string(),
  password: z.string().min(6),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),

  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  existingConditions: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactLocation: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  primaryPhysician: z.string().optional(),
});

export type CreatePatientDTO = z.infer<typeof CreatePatientSchema>;

