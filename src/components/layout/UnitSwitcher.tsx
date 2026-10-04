import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUnit } from "@/features/units/UnitContext";
import { Building2, Check, ChevronDown } from "lucide-react";

export function UnitSwitcher() {
  const { units, activeUnit, setActiveUnit, isLoadingUnits } = useUnit();

  if (isLoadingUnits) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 min-h-11">
        <Building2 className="w-4 h-4 animate-pulse" />
        <span>Memuat unit...</span>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 min-h-11">
        <Building2 className="w-4 h-4" />
        <span>Tidak ada unit</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium min-h-11">
        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="truncate max-w-40">{activeUnit ? activeUnit.name : "Pilih Unit"}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active Unit" />
        <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="left" className="w-64">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
          Daftar Unit Operasional
        </div>
        <div className="max-h-60 overflow-y-auto py-1">
          {units.map((unit) => {
            const isActive = activeUnit?.id === unit.id;
            return (
              <DropdownMenuItem
                key={unit.id}
                onClick={() => setActiveUnit(unit)}
                className={`flex items-center justify-between px-3 py-2.5 min-h-11 ${
                  isActive ? "bg-blue-50 text-blue-700 font-semibold" : ""
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Building2
                    className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <span className="truncate">{unit.name}</span>
                </div>
                {isActive && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
