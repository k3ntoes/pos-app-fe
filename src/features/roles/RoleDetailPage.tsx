import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoleDetail } from "@/hooks/useRoleDetail";
import { Link } from "react-router-dom";
import { PermissionMatrix } from "./PermissionMatrix";

export function RoleDetailPage() {
  const { role, isLoading, error, navigate } = useRoleDetail();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat detail role...</div>;
  }

  if (error || !role) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-600 font-semibold">Role tidak ditemukan atau gagal dimuat.</p>
        <Button onClick={() => navigate("/roles")}>Kembali ke Daftar Roles</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{role.name}</h1>
            {role.is_system ? (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">System Role</Badge>
            ) : (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Custom Role</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{role.description || "Tidak ada deskripsi."}</p>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/roles"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-[44px] border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
          >
            Kembali
          </Link>
          <Link
            to={`/roles/${role.id}/edit`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-[44px] bg-blue-600 text-white hover:bg-blue-700 shadow h-11 px-4 py-2"
          >
            Edit Role
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Ringkasan Penugasan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Jumlah User Assigned
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {role?.assigned_users_count ?? 0} user
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Permissions Aktif
            </span>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {role.permissions?.length || 0} permissions
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Permission Matrix</h2>
        <PermissionMatrix
          selectedPermissions={role.permissions || []}
          onChange={() => {}}
          readOnly={true}
        />
      </div>
    </div>
  );
}
