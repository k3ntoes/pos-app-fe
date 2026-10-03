import { type Role, rolesApi } from "@/api/roles";
import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { type CreateUserFormValues, createUserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TemporaryPasswordModal } from "./TemporaryPasswordModal";

export function CreateUserPage() {
  const navigate = useNavigate();
  const [createdUserData, setCreatedUserData] = React.useState<{
    name: string;
    temporary_password: string;
  } | null>(null);

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
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      unit_role_assignments: [{ unit_id: "", role_id: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "unit_role_assignments",
  });

  const mutation = useMutation({
    mutationFn: (data: CreateUserFormValues) => usersApi.createUser(data),
    onSuccess: (response) => {
      toast.success("User berhasil dibuat");
      setCreatedUserData({
        name: response.full_name || response.name || "",
        temporary_password: response.temporary_password || "TEMP_PASS_123!",
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal membuat user baru");
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tambah User Baru</h1>
          <p className="text-sm text-gray-500">
            Buat akun user baru dan tentukan penugasan unit serta role.
          </p>
        </div>
        <Button asChild variant="outline" className="min-h-[44px]">
          <Link to="/users">Kembali</Link>
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="create-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <Input id="create-name" {...register("full_name")} placeholder="Contoh: Budi Santoso" />
            {errors.full_name && (
              <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="create-username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <Input
              id="create-username"
              {...register("username")}
              placeholder="Contoh: budisantoso"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="create-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="create-email"
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
          {errors.unit_role_assignments && (
            <p className="mb-2 text-xs text-red-600">{errors.unit_role_assignments.message}</p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-end gap-3 p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex-1">
                  <label
                    htmlFor={`unit-${index}`}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Unit
                  </label>
                  <Select
                    id={`unit-${index}`}
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
                    htmlFor={`role-${index}`}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <Select
                    id={`role-${index}`}
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
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                    className="min-h-[40px] text-red-600 hover:text-red-700"
                  >
                    Hapus
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={() => navigate("/users")}>
            Batal
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan & Buat User"}
          </Button>
        </div>
      </form>

      {createdUserData && (
        <TemporaryPasswordModal
          open={!!createdUserData}
          userName={createdUserData.name}
          temporaryPassword={createdUserData.temporary_password}
          onClose={() => {
            setCreatedUserData(null);
            navigate("/users");
          }}
        />
      )}
    </div>
  );
}
