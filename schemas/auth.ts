import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .email("Please enter a valid email address")
    .transform((email) => email.toLowerCase().trim()),
});

export const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const usernameSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type CreatePasswordSchema = z.infer<typeof createPasswordSchema>;
export type UsernameSchema = z.infer<typeof usernameSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
