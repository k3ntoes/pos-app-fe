import { z } from "zod";

export const createUnitSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(50, "Code must be at most 50 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  address: z.string().max(255, "Address must be at most 255 characters").nullable().optional(),
  is_active: z.boolean().default(true).optional(),
});

export const updateUnitSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must be at most 100 characters")
    .nullable()
    .optional(),
  address: z.string().max(255, "Address must be at most 255 characters").nullable().optional(),
  is_active: z.boolean().nullable().optional(),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
