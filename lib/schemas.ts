import { z } from "zod";

// Rate limiting schema for client-side
export const rateLimitSchema = z.object({
  attempts: z
    .number()
    .max(5, "Too many attempts. Please wait before trying again."),
  lastAttempt: z.date(),
});

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
