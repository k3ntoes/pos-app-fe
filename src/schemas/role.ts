import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(3, "Nama role minimal 3 karakter"),
  code: z
    .string()
    .min(2, "Kode role minimal 2 karakter")
    .max(50, "Kode role maksimal 50 karakter")
    .optional()
    .nullable(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(3, "Nama role minimal 3 karakter").optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
