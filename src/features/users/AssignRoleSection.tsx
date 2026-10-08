import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { RoleListItem } from "@/types/role";
import type { Unit } from "@/types/unit";
import type { UserRoleAssignmentResponse } from "@/types/user";
import { Plus } from "lucide-react";
import * as React from "react";

export interface AssignRoleSectionProps {
  units: Unit[];
  roles: RoleListItem[];
  activeRoles: UserRoleAssignmentResponse[];
  onAssign: (unitId: string | null, roleId: string) => Promise<unknown>;
  isAssigning?: boolean;
}

export function AssignRoleSection({
  units,
  roles,
  activeRoles,
  onAssign,
  isAssigning,
}: AssignRoleSectionProps) {
  const [selectedUnitValue, setSelectedUnitValue] = React.useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");

  const isRoleAssigned = (roleId: string) => {
    const targetUnitId = selectedUnitValue === "" ? null : selectedUnitValue;
    return activeRoles.some((a) => a.role_id === roleId && (a.unit_id || null) === targetUnitId);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnitVal = e.target.value;
    setSelectedUnitValue(newUnitVal);
    const targetUnitId = newUnitVal === "" ? null : newUnitVal;
    const isNowAssigned = activeRoles.some(
      (a) => a.role_id === selectedRoleId && (a.unit_id || null) === targetUnitId,
    );
    if (isNowAssigned) {
      setSelectedRoleId("");
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoleId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId || isRoleAssigned(selectedRoleId)) return;
    const unitId = selectedUnitValue === "" ? null : selectedUnitValue;
    await onAssign(unitId, selectedRoleId);
    setSelectedRoleId("");
  };

  const isCurrentSelectionAssigned = Boolean(selectedRoleId) && isRoleAssigned(selectedRoleId);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-4"
    >
      <div className="font-medium text-sm text-gray-900">Tugaskan Role Baru</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="assign-unit-select"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Pilih Unit
          </label>
          <Select id="assign-unit-select" value={selectedUnitValue} onChange={handleUnitChange}>
            <option value="">Semua Unit (Global)</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label
            htmlFor="assign-role-select"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Pilih Role
          </label>
          <Select id="assign-role-select" value={selectedRoleId} onChange={handleRoleChange}>
            <option value="" disabled>
              -- Pilih Role --
            </option>
            {roles.map((role) => {
              const disabled = isRoleAssigned(role.id);
              const label = disabled
                ? `${role.name} (Sudah Ditugaskan)`
                : role.is_system
                  ? `${role.name} [System]`
                  : role.name;
              return (
                <option key={role.id} value={role.id} disabled={disabled}>
                  {label}
                </option>
              );
            })}
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          size="sm"
          disabled={!selectedRoleId || isCurrentSelectionAssigned || Boolean(isAssigning)}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {isAssigning ? "Menugaskan..." : "Tugaskan Role"}
        </Button>
      </div>
    </form>
  );
}
