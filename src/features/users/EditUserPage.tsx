import { type Role, rolesApi } from "@/api/roles";
import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { type UpdateUserFormValues, updateUserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.getUserById(id || ""),
    enabled: Boolean(id),
  });

  const { data: unitsResponse } = useQuery({
    queryKey: ["units"],
    queryFn: () => unitsApi.getUnits(),
  });
  const units = unitsResponse?.units ?? [];

  const { data: rolesData } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: () => rolesApi.getRoles(),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      unit_role_assignments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "unit_role_assignments",
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        unit_role_assignments:
          user.unit_role_assignments?.map((a) => ({
            unit_id: a.unit_id,
            role_id: a.role_id,
          })) || [],
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdateUserFormValues) => usersApi.updateUser(id || "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success("User berhasil diperbarui");
      navigate(`/users/${id}`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal memperbarui user");
    },
  });

  const onSubmit = (data: UpdateUserFormValues) => {
    mutation.mutate(data);
  };

  if (isUserLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat data user...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit User</h1>
          <p className="text-sm text-gray-500">Perbarui informasi profil dan penugasan unit.</p>
        </div>
        <Button asChild variant="outline" className="min-h-[44px]">
          <Link to={`/users/${id}`}>Kembali</Link>
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <Input id="edit-name" {...register("name")} placeholder="Contoh: Budi Santoso" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="edit-email"
              type="email"
              {...register("email")}
              placeholder="Contoh: budi@pos.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Penugasan Unit & Role</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ unit_id: "", role_id: "" })}
            >
              + Tambah Penugasan
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-end gap-3 p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex-1">
                  <label
                    htmlFor={`edit-unit-${index}`}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Unit
                  </label>
                  <Select
                    id={`edit-unit-${index}`}
                    {...register(`unit_role_assignments.${index}.unit_id` as const)}
                  >
                    <option value="">Pilih Unit</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={`edit-role-${index}`}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <Select
                    id={`edit-role-${index}`}
                    {...register(`unit_role_assignments.${index}.role_id` as const)}
                  >
                    <option value="">Pilih Role</option>
                    {rolesData?.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(index)}
                  className="min-h-[40px] text-red-600 hover:text-red-700"
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={() => navigate(`/users/${id}`)}>
            Batal
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
