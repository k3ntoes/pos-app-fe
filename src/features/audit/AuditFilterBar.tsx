import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { AuditLogFilterParams } from "@/types/audit";
import { RotateCcw, Search } from "lucide-react";
import type React from "react";

interface AuditFilterBarProps {
  filters: AuditLogFilterParams;
  onFilterChange: (filters: Partial<AuditLogFilterParams>) => void;
  onReset: () => void;
}

const ACTION_OPTIONS = [
  { value: "", label: "Semua Action" },
  { value: "CREATE", label: "CREATE" },
  { value: "UPDATE", label: "UPDATE" },
  { value: "DELETE", label: "DELETE" },
  { value: "LOGIN", label: "LOGIN" },
  { value: "LOGOUT", label: "LOGOUT" },
  { value: "STATUS_CHANGE", label: "STATUS_CHANGE" },
  { value: "PASSWORD_RESET", label: "PASSWORD_RESET" },
];

export const AuditFilterBar: React.FC<AuditFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari user, resource, IP..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="pl-9"
          />
        </div>

        {/* Action Select */}
        <Select
          value={filters.action || ""}
          onChange={(e) => onFilterChange({ action: e.target.value, page: 1 })}
        >
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* Resource Type */}
        <Input
          placeholder="Resource Type (e.g. User, Unit)"
          value={filters.resource_type || ""}
          onChange={(e) => onFilterChange({ resource_type: e.target.value, page: 1 })}
        />

        {/* Start Date */}
        <Input
          type="date"
          placeholder="Dari Tanggal"
          value={filters.start_date || ""}
          onChange={(e) => onFilterChange({ start_date: e.target.value, page: 1 })}
        />

        {/* End Date */}
        <Input
          type="date"
          placeholder="Sampai Tanggal"
          value={filters.end_date || ""}
          onChange={(e) => onFilterChange({ end_date: e.target.value, page: 1 })}
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Filter</span>
        </Button>
      </div>
    </div>
  );
};
