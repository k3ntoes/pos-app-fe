import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useManageUserRoles } from "@/hooks/useManageUserRoles";
import type { UserRoleAssignmentResponse } from "@/types/user";
import * as React from "react";
import { ActiveRolesTable } from "./ActiveRolesTable";
import { AssignRoleSection } from "./AssignRoleSection";

export interface ManageUserRolesModalProps {
  open?: boolean;
  isOpen?: boolean;
  userId?: string | null;
  userName?: string;
  onClose: () => void;
}

export function ManageUserRolesModal({
  open,
  isOpen,
  userId,
  userName = "Pengguna",
  onClose,
}: ManageUserRolesModalProps) {
  const isModalOpen = open ?? isOpen ?? false;

  const {
    activeRoles,
    isLoadingActiveRoles,
    units,
    roles,
    assignRole,
    isAssigning,
    revokeRole,
    isRevoking,
  } = useManageUserRoles({ userId: userId || undefined });

  const [roleToRevoke, setRoleToRevoke] = React.useState<UserRoleAssignmentResponse | null>(null);

  const handleConfirmRevoke = async () => {
    if (!roleToRevoke) return;
    try {
      await revokeRole(roleToRevoke.id);
      setRoleToRevoke(null);
    } catch {
      // Handled in mutation onError
    }
  };

  const getTargetUnitName = (unitId?: string | null) => {
    if (!unitId) return "Semua Unit (Global)";
    const found = units.find((u) => u.id === unitId);
    return found ? found.name : unitId;
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola Role: {userName}</DialogTitle>
            <DialogDescription>
              Atur penugasan dan pencabutan hak akses role untuk pengguna ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Daftar Role Aktif ({activeRoles.length})
              </h3>
              <ActiveRolesTable
                roles={activeRoles}
                units={units}
                isLoading={isLoadingActiveRoles}
                onRevokeClick={(role) => setRoleToRevoke(role)}
                isRevoking={isRevoking}
              />
            </div>

            <AssignRoleSection
              units={units}
              roles={roles}
              activeRoles={activeRoles}
              onAssign={async (unitId, roleId) => {
                await assignRole({ unitId, roleId });
              }}
              isAssigning={isAssigning}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi Destruktif Cabut Role */}
      <Dialog open={Boolean(roleToRevoke)} onOpenChange={(val) => !val && setRoleToRevoke(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Cabut Role Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mencabut role{" "}
              <span className="font-semibold text-gray-900">{roleToRevoke?.role_name}</span> pada
              unit{" "}
              <span className="font-semibold text-gray-900">
                {getTargetUnitName(roleToRevoke?.unit_id)}
              </span>{" "}
              dari <span className="font-semibold text-gray-900">{userName}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
