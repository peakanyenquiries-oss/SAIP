import { z } from "zod";

export const customerSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;