import { z } from "zod";

export const CreateTicketSchema = z.object({
  subject: z.string().min(1),
  category: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  message: z.string().min(1),
});

export type CreateTicketDTO = z.infer<typeof CreateTicketSchema>;
