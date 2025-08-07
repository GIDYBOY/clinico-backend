
import { z } from "zod";


export const CreateDoctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  gender: z.string().min(1, "Gender is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  phone: z.string(),
  address: z.string(),
  dateOfBirth: z.string().datetime(),
  accessCode: z.string().optional(), // Optional access code for registration

  image: z.string().url().optional(), // Optional profile image URL
  specialization: z.string().min(1, "Specialization is required"),
  department: z
    .enum([
      "PRIMARY_CARE",
      "CHILDREN_HEALTH",
      "MEDICAL_SPECIALTIES",
      "MENTAL_HEALTH",
      "DENTAL_CARE",
    ]),
  education: z.string().optional(),
  certifications: z.string().optional(),
  yearsOfExperience: z.coerce.number().optional(),
  medicalLicenseNumber: z.string().optional(),
});

export type CreateDoctorDTO = z.infer<typeof CreateDoctorSchema>;

export const UpdateDoctorProfileSchema = z.object({
  name: z.string().optional(),
  image: z.string().url().optional(),
  specialization: z.string().optional(),
  department: z
    .enum([
      "PRIMARY_CARE",
      "CHILDREN_HEALTH",
      "MEDICAL_SPECIALTIES",
      "MENTAL_HEALTH",
      "DENTAL_CARE",
    ])
    .optional(),
});

export type UpdateDoctorProfileDTO = z.infer<typeof UpdateDoctorProfileSchema>;