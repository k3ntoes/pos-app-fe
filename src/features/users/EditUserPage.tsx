import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditUser } from "@/hooks/useEditUser";
import { Globe } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { ManageUserRolesModal } from "./ManageUserRolesModal";

export function EditUserPage() {
  const { id, user, isUserLoading, register, handleSubmit, errors, isPending } = useEditUser();
  const [isManageRolesOpen, setIsManageRolesOpen] = React.useState(false);

  if (isUserLoading || !user) {
    return <div className="p-8 text-center text-gray-500">Memuat data user...</div>;
  }

  const getUnitName = (unitId?: string | null, fallbackName?: string) => {
    if (!unitId) return "Semua Unit (Global)";
    return fallbackName || unitId;
  };

  const assignments = user.unit_role_assignments || [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit User</h1>
          <p className="text-sm text-gray-500">Perbarui informasi profil pengguna.</p>
        </div>
        <Link
          to={`/users/${id}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
        >
          Kembali
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
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

        {/* Ringkasan Penugasan Role & Shortcut */}
        <div className="border-t border-gray-200 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Penugasan Unit & Role</h3>
              <p className="text-xs text-gray-500">
                Kelola hak akses dan penugasan unit melalui menu khusus.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsManageRolesOpen(true)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Kelola Role
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
            {assignments.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Tidak ada penugasan unit dan role aktif.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {assignments.map((assignment, idx) => {
                  const isGlobal = !assignment.unit_id;
                  const unitLabel = getUnitName(assignment.unit_id, assignment.unit_name);
                  const roleLabel = assignment.role_name || assignment.role_id;
                  return (
                    <div
                      key={assignment.id || `${assignment.unit_id}-${assignment.role_id}-${idx}`}
                      className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-gray-200 text-xs shadow-xs"
                    >
                      {isGlobal && <Globe className="h-3.5 w-3.5 text-blue-600" />}
                      <span className="font-semibold text-gray-900">{unitLabel}</span>
                      <span className="text-gray-400">•</span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {roleLabel}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            to={`/users/${id}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
          >
            Batal
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>

      <ManageUserRolesModal
        isOpen={isManageRolesOpen}
        userId={user.id}
        userName={user.name}
        onClose={() => setIsManageRolesOpen(false)}
      />
    </div>
  );
}
