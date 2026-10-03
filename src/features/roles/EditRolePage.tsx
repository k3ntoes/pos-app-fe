import { rolesApi } from "@/api/roles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type UpdateRoleFormValues, updateRoleSchema } from "@/schemas/role";
import type { PermissionType } from "@/types/permission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PermissionMatrix } from "./PermissionMatrix";

export function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const roleId = id as string;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: role, isLoading: isFetching } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => rolesApi.getRoleById(roleId),
    enabled: Boolean(roleId),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  React.useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions || [],
      });
    }
  }, [role, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdateRoleFormValues) =>
      rolesApi.updateRole(roleId, {
        name: role?.is_system ? undefined : data.name,
        description: data.description,
        permissions: data.permissions as PermissionType[],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", roleId] });
      toast.success("Role berhasil diperbarui");
      navigate("/roles");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal memperbarui role");
    },
  });

  const onSubmit = (data: UpdateRoleFormValues) => {
    mutation.mutate(data);
  };

  if (isFetching) {
    return <div className="p-8 text-center text-gray-500">Memuat data role...</div>;
  }

  if (!role) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-600 font-semibold">Role tidak ditemukan.</p>
        <Button onClick={() => navigate("/roles")}>Kembali ke Daftar Roles</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950">
              Edit Role: {role.name}
            </h1>
            {role.is_system && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">System Role</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {role.is_system
              ? "Nama system role bersifat read-only. Anda dapat menyesuaikan deskripsi dan permission."
              : "Perbarui informasi nama, deskripsi, dan permission role."}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/roles">Kembali</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Role</Label>
            <Input
              id="name"
              {...register("name")}
              readOnly={role.is_system}
              className={role.is_system ? "bg-gray-100 cursor-not-allowed" : ""}
            />
            {role.is_system && (
              <p className="text-xs text-gray-500">System role name tidak dapat diubah.</p>
            )}
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              placeholder="Deskripsi singkat fungsi role"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Permission Matrix</h2>
            {errors.permissions && (
              <span className="text-sm text-red-600">{errors.permissions.message}</span>
            )}
          </div>
          <Controller
            control={control}
            name="permissions"
            render={({ field }) => (
              <PermissionMatrix
                selectedPermissions={(field.value || []) as PermissionType[]}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" asChild>
            <Link to="/roles">Batal</Link>
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
