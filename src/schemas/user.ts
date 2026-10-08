import { z } from "zod";

export const unitRoleAssignmentSchema = z.object({
  unit_id: z.string().min(1, "Unit wajib dipilih"),
  role_id: z.string().min(1, "Role wajib dipilih"),
});

export const createUserSchema = z.object({
  full_name: z
    .string()
    .min(1, "Nama lengkap minimal 1 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  unit_role_assignments: z.array(unitRoleAssignmentSchema).optional(),
});

export const updateUserSchema = z.object({
  full_name: z
    .string()
    .min(1, "Nama lengkap minimal 1 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter")
    .optional(),
  name: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")).nullable(),
});

export const userStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"], {
    errorMap: () => ({ message: "Status tidak valid" }),
  }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type UserStatusFormValues = z.infer<typeof userStatusSchema>;
