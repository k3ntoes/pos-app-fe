import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserDetail } from "@/hooks/useUserDetail";
import { Link, useNavigate } from "react-router-dom";
import { UserDetailRolesSection } from "./UserDetailRolesSection";

export function UserDetailPage() {
  const navigate = useNavigate();
  const { user, isLoading, error } = useUserDetail();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat detail user...</div>;
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-600 font-medium">
          Gagal memuat detail user atau user tidak ditemukan.
        </p>
        <Button onClick={() => navigate("/users")} variant="outline">
          Kembali ke Daftar User
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 border-green-200">ACTIVE</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">SUSPENDED</Badge>;
      case "DEACTIVATED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">DEACTIVATED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{user.name}</h1>
            {getStatusBadge(user.status)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            @{user.username} • {user.email}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/users"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
          >
            Kembali
          </Link>
          <Link
            to={`/users/${user.id}/edit`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 bg-blue-600 text-white hover:bg-blue-700 shadow h-11 px-4 py-2"
          >
            Edit User
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID User
          </span>
          <p className="text-sm font-mono text-gray-900 mt-1">{user.id}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Wajib Ganti Password
          </span>
          <p className="text-sm text-gray-900 mt-1">
            {user.must_change_password ? "Ya (Belum login pertama)" : "Tidak"}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Dibuat Pada
          </span>
          <p className="text-sm tabular-nums text-gray-900 mt-1">
            {new Date(user.created_at).toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Diperbarui Pada
          </span>
          <p className="text-sm tabular-nums text-gray-900 mt-1">
            {new Date(user.updated_at).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <UserDetailRolesSection user={user} />
    </div>
  );
}
