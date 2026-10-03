import { rolesApi } from "@/api/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type CreateRoleFormValues, createRoleSchema } from "@/schemas/role";
import type { PermissionType } from "@/types/permission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PermissionMatrix } from "./PermissionMatrix";

export function CreateRolePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateRoleFormValues) =>
      rolesApi.createRole({
        name: data.name,
        description: data.description,
        permissions: data.permissions as PermissionType[],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role baru berhasil dibuat");
      navigate("/roles");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal membuat role baru");
    },
  });

  const onSubmit = (data: CreateRoleFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tambah Role Baru</h1>
          <p className="text-sm text-gray-500">
            Definisikan nama role dan pilih hak akses granular (permissions) untuk role tersebut.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/roles">Kembali</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Role <span className="text-red-500">*</span>
            </Label>
            <Input id="name" placeholder="Contoh: Supervisor Kasir" {...register("name")} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              placeholder="Deskripsi singkat fungsi role ini"
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
            {mutation.isPending ? "Menyimpan..." : "Simpan Role"}
          </Button>
        </div>
      </form>
    </div>
  );
}
