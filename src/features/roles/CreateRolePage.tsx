import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateRole } from "@/hooks/useCreateRole";
import type { PermissionType } from "@/types/permission";
import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { PermissionMatrix } from "./PermissionMatrix";

export function CreateRolePage() {
  const { register, control, handleSubmit, errors, mutation, onSubmit } = useCreateRole();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tambah Role Baru</h1>
          <p className="text-sm text-gray-500">
            Definisikan nama role dan pilih hak akses granular (permissions) untuk role tersebut.
          </p>
        </div>
        <Link
          to="/roles"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-[44px] border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
        >
          Kembali
        </Link>
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
          <Link
            to="/roles"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-[44px] border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
          >
            Batal
          </Link>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Role"}
          </Button>
        </div>
      </form>
    </div>
  );
}
