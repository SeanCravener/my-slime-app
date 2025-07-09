import { z } from "zod";

// Password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

// Email validation
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Please enter a valid email address")
  .transform((email) => email.toLowerCase().trim());

export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Rate limiting schema for client-side
export const rateLimitSchema = z.object({
  attempts: z
    .number()
    .max(5, "Too many attempts. Please wait before trying again."),
  lastAttempt: z.date(),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export const ingredientSchema = z.object({
  value: z.string().min(1, "Ingredient cannot be empty"),
});

export const instructionSchema = z.object({
  "image-url": z.string(),
  content: z.string().min(1, "Instruction content is required"),
});

export const itemFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  main_image: z.string().min(1, "Main image is required"),
  category_id: z.number().nullable(),
  ingredients: z
    .array(ingredientSchema)
    .min(2, "At least two ingredients are required")
    .max(20, "Maximum 20 ingredients allowed"),
  instructions: z
    .array(instructionSchema)
    .min(2, "At least two instructions are required")
    .max(20, "Maximum 20 instructions allowed"),
});

export const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
});

export type ItemFormSchema = z.infer<typeof itemFormSchema>;
export type InstructionSchema = z.infer<typeof instructionSchema>;
export type RatingSchema = z.infer<typeof ratingSchema>;
