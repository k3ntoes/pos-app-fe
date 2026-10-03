import { Button } from "@/components/ui/button";
import type { PermissionType } from "@/types/permission";
import type { PermissionDomain } from "@/types/role";

export const PERMISSION_DOMAINS: PermissionDomain[] = [
  {
    domain: "users",
    title: "Manajemen Users",
    permissions: [
      { id: "users:create", label: "Buat User Baru", description: "Dapat membuat akun user baru" },
      {
        id: "users:read",
        label: "Lihat Users",
        description: "Dapat melihat daftar dan detail user",
      },
      {
        id: "users:update",
        label: "Edit User",
        description: "Dapat memperbarui data dan status user",
      },
      { id: "users:delete", label: "Hapus User", description: "Dapat menghapus user sistem" },
    ],
  },
  {
    domain: "roles",
    title: "Manajemen Roles & Permissions",
    permissions: [
      { id: "roles:create", label: "Buat Role", description: "Dapat membuat role baru" },
      {
        id: "roles:read",
        label: "Lihat Roles",
        description: "Dapat melihat daftar role dan permission",
      },
      { id: "roles:update", label: "Edit Role", description: "Dapat mengubah permission role" },
      { id: "roles:delete", label: "Hapus Role", description: "Dapat menghapus role custom" },
    ],
  },
  {
    domain: "units",
    title: "Manajemen Units / Cabang",
    permissions: [
      { id: "units:read", label: "Lihat Units", description: "Dapat melihat daftar unit/cabang" },
      { id: "units:update", label: "Edit Unit", description: "Dapat memperbarui konfigurasi unit" },
    ],
  },
  {
    domain: "pos",
    title: "Cashier / POS",
    permissions: [
      {
        id: "pos:cashier",
        label: "Akses Kasir",
        description: "Dapat melakukan transaksi penjualan POS",
      },
      {
        id: "pos:orders",
        label: "Kelola Pesanan",
        description: "Dapat melihat dan mengelola pesanan aktif",
      },
      {
        id: "pos:void",
        label: "Void Transaksi",
        description: "Dapat melakukan void/pembatalan transaksi",
      },
    ],
  },
  {
    domain: "audit",
    title: "Audit Trail",
    permissions: [
      {
        id: "audit:read",
        label: "Lihat Audit Logs",
        description: "Dapat melihat log aktivitas sistem",
      },
    ],
  },
  {
    domain: "reports",
    title: "Reports / Laporan",
    permissions: [
      {
        id: "reports:read",
        label: "Lihat Laporan",
        description: "Dapat mengakses laporan penjualan dan keuangan",
      },
    ],
  },
  {
    domain: "settings",
    title: "Settings / Pengaturan",
    permissions: [
      {
        id: "settings:manage",
        label: "Kelola Pengaturan",
        description: "Dapat mengubah pengaturan sistem umum",
      },
    ],
  },
];

interface PermissionMatrixProps {
  selectedPermissions: PermissionType[];
  onChange: (permissions: PermissionType[]) => void;
  readOnly?: boolean;
}

export function PermissionMatrix({
  selectedPermissions,
  onChange,
  readOnly = false,
}: PermissionMatrixProps) {
  const handleToggle = (permissionId: PermissionType) => {
    if (readOnly) return;
    if (selectedPermissions.includes(permissionId)) {
      onChange(selectedPermissions.filter((p) => p !== permissionId));
    } else {
      onChange([...selectedPermissions, permissionId]);
    }
  };

  const handleSelectAllDomain = (domainPerms: { id: PermissionType }[]) => {
    if (readOnly) return;
    const permIds = domainPerms.map((p) => p.id);
    const combined = Array.from(new Set([...selectedPermissions, ...permIds]));
    onChange(combined);
  };

  const handleDeselectAllDomain = (domainPerms: { id: PermissionType }[]) => {
    if (readOnly) return;
    const permIds = new Set(domainPerms.map((p) => p.id));
    onChange(selectedPermissions.filter((p) => !permIds.has(p)));
  };

  return (
    <div className="space-y-6">
      {PERMISSION_DOMAINS.map((domain) => {
        const domainPermIds = domain.permissions.map((p) => p.id);
        const allSelected = domainPermIds.every((id) => selectedPermissions.includes(id));

        return (
          <div
            key={domain.domain}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-semibold text-gray-900">{domain.title}</h3>
              {!readOnly && (
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      allSelected
                        ? handleDeselectAllDomain(domain.permissions)
                        : handleSelectAllDomain(domain.permissions)
                    }
                  >
                    {allSelected ? "Hapus Semua Domain" : "Pilih Semua Domain"}
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {domain.permissions.map((perm) => {
                const checked = selectedPermissions.includes(perm.id);
                return (
                  <label
                    key={perm.id}
                    className={`flex items-start space-x-3 p-3 rounded-md border transition-colors ${
                      checked ? "bg-indigo-50/50 border-indigo-200" : "bg-gray-50 border-gray-200"
                    } ${readOnly ? "cursor-default" : "cursor-pointer hover:bg-gray-100/80"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggle(perm.id)}
                      disabled={readOnly}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1 text-sm">
                      <span className="font-medium text-gray-900">{perm.label}</span>
                      {perm.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
