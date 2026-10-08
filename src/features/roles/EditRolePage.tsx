import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditRole } from "@/hooks/useEditRole";
import type { PermissionType } from "@/types/permission";
import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { PermissionMatrix } from "./PermissionMatrix";

export function EditRolePage() {
  const {
    role,
    isFetching,
    register,
    control,
    handleSubmit,
    errors,
    mutation,
    onSubmit,
    navigate,
  } = useEditRole();

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
        <Link
          to="/roles"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
        >
          Kembali
        </Link>
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
          <Link
            to="/roles"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
          >
            Batal
          </Link>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
