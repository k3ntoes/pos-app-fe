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
import type { Unit } from "@/types/unit";
import type { UserRoleAssignmentResponse } from "@/types/user";
import { Globe, Trash2 } from "lucide-react";

export interface ActiveRolesTableProps {
  roles: UserRoleAssignmentResponse[];
  units: Unit[];
  isLoading?: boolean;
  onRevokeClick: (role: UserRoleAssignmentResponse) => void;
  isRevoking?: boolean;
}

export function ActiveRolesTable({
  roles,
  units,
  isLoading,
  onRevokeClick,
  isRevoking,
}: ActiveRolesTableProps) {
  const getUnitName = (unitId?: string | null) => {
    if (!unitId) return "Semua Unit (Global)";
    const found = units.find((u) => u.id === unitId);
    return found ? found.name : unitId;
  };

  if (isLoading) {
    return (
      <div className="py-6 text-center text-sm text-gray-500">Memuat daftar role pengguna...</div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        Pengguna ini belum memiliki role yang ditugaskan.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-2/5">Cakupan Unit</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead className="w-24 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((assignment) => {
            const isGlobal = !assignment.unit_id;
            return (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium text-gray-900">
                  <div className="flex items-center gap-1.5">
                    {isGlobal && <Globe className="h-4 w-4 text-blue-600" />}
                    <span>{getUnitName(assignment.unit_id)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-gray-900">{assignment.role_name}</span>
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
                    onClick={() => onRevokeClick(assignment)}
                    disabled={isRevoking}
                    aria-label={`Cabut role ${assignment.role_name}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cabut
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
