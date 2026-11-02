import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Plan name must be at least 3 characters")
    .max(50, "Plan name cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),

  price: z
    .number()
    .min(1, "Price is required")
    .refine(
      (value) => Number.isFinite(value) && value > 0,
      "Price must be greater than 0",
    ),

  duration_months: z
    .number()
    .min(1, "Duration is required")
    .refine(
      (value) => Number.isInteger(value) && value > 0,
      "Duration must be a valid positive number",
    ),

  is_active: z.boolean().optional(),
});
