import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),

  firstName: z.string().trim().min(1, "First name is required"),

  lastName: z.string().trim().min(1, "Last name is required"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});
