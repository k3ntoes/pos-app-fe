import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useManageUserRoles } from "@/hooks/useManageUserRoles";
import type { UserDetail } from "@/types/user";
import { Globe, Trash2 } from "lucide-react";
import * as React from "react";
import { ManageUserRolesModal } from "./ManageUserRolesModal";

export interface UserDetailRolesSectionProps {
  user: UserDetail;
}

export function UserDetailRolesSection({ user }: UserDetailRolesSectionProps) {
  const [isManageRolesOpen, setIsManageRolesOpen] = React.useState(false);

  const { activeRoles, isLoadingActiveRoles, units, revokeRole, isRevoking } = useManageUserRoles({
    userId: user?.id,
  });

  const [roleToRevoke, setRoleToRevoke] = React.useState<(typeof activeRoles)[number] | null>(null);

  const handleConfirmRevoke = async () => {
    if (!roleToRevoke) return;
    try {
      await revokeRole(roleToRevoke.id);
      setRoleToRevoke(null);
    } catch {
      // Handled by hook
    }
  };

  const getUnitName = (unitId?: string | null, fallbackName?: string) => {
    if (!unitId) return "Semua Unit (Global)";
    const found = units.find((u) => u.id === unitId);
    return found?.name || fallbackName || unitId;
  };

  const displayAssignments =
    activeRoles.length > 0
      ? activeRoles.map((a) => ({
          id: a.id,
          unit_id: a.unit_id,
          unit_name: getUnitName(a.unit_id),
          role_id: a.role_id,
          role_name: a.role_name,
          is_system: a.is_system,
        }))
      : (user.unit_role_assignments || []).map((a, idx) => ({
          id: `asg-${idx}`,
          unit_id: a.unit_id,
          unit_name: getUnitName(a.unit_id, a.unit_name),
          role_id: a.role_id,
          role_name: a.role_name || a.role_id,
          is_system: false,
        }));

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Penugasan Unit & Role</h2>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setIsManageRolesOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Tambah Role
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Cakupan Unit</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tipe (Badge System vs Custom)</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingActiveRoles ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  Memuat data penugasan...
                </TableCell>
              </TableRow>
            ) : displayAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  Tidak ada penugasan unit dan role untuk user ini.
                </TableCell>
              </TableRow>
            ) : (
              displayAssignments.map((assignment) => {
                const isGlobal = !assignment.unit_id;
                return (
                  <TableRow key={assignment.id || `${assignment.unit_id}-${assignment.role_id}`}>
                    <TableCell className="font-medium text-gray-900">
                      <div className="flex items-center gap-1.5">
                        {isGlobal && <Globe className="h-4 w-4 text-blue-600" />}
                        <span>{assignment.unit_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        {assignment.role_name || assignment.role_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      {assignment.is_system ? (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          System Role
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600">
                          Custom Role
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                        onClick={() => setRoleToRevoke(assignment)}
                        disabled={isRevoking}
                        aria-label={`Cabut role ${assignment.role_name || assignment.role_id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cabut
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Manage User Roles Modal */}
      <ManageUserRolesModal
        isOpen={isManageRolesOpen}
        userId={user.id}
        userName={user.name}
        onClose={() => setIsManageRolesOpen(false)}
      />

      {roleToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-red-600">Cabut Role Pengguna</h3>
            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin mencabut role{" "}
              <span className="font-semibold text-gray-900">
                {roleToRevoke.role_name || roleToRevoke.role_id}
              </span>{" "}
              pada unit{" "}
              <span className="font-semibold text-gray-900">
                {getUnitName(roleToRevoke.unit_id)}
              </span>{" "}
              dari <span className="font-semibold text-gray-900">{user.name}</span>?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRoleToRevoke(null)}
                disabled={isRevoking}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmRevoke}
                disabled={isRevoking}
              >
                {isRevoking ? "Mencabut..." : "Ya, Cabut Role"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
