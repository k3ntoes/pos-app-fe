import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Unit } from "@/types/unit";
import type { UserStatus } from "@/types/user";

interface UserFilterBarProps {
  search: string;
  statusFilter: UserStatus | "";
  unitFilter: string;
  units: Unit[];
  onSearch: (value: string) => void;
  onFilterChange: (type: "status" | "unit", value: string) => void;
}

export function UserFilterBar({
  search,
  statusFilter,
  unitFilter,
  units,
  onSearch,
  onFilterChange,
}: UserFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex-1">
        <Input
          placeholder="Cari nama, username, atau email..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select
          value={statusFilter}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="w-40"
        >
          <option value="">Semua Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="DEACTIVATED">DEACTIVATED</option>
        </Select>
        <Select
          value={unitFilter}
          onChange={(e) => onFilterChange("unit", e.target.value)}
          className="w-45"
        >
          <option value="">Semua Unit</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
