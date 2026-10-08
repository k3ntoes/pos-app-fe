import { usePermissions } from "@/features/roles/usePermissions";
import type { PermissionType } from "@/types/permission";
import { Activity, Building, LayoutDashboard, Shield, ShoppingBag, Users } from "lucide-react";
import type React from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: PermissionType;
}

export function Sidebar() {
  const { hasPermission } = usePermissions();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      to: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      to: "/users",
      icon: Users,
      permission: "users:read",
    },
    {
      label: "Roles",
      to: "/roles",
      icon: Shield,
      permission: "roles:read",
    },
    {
      label: "Units",
      to: "/units",
      icon: Building,
      permission: "units:read",
    },
    {
      label: "Cashier (POS)",
      to: "/pos",
      icon: ShoppingBag,
      permission: "pos:cashier",
    },
    {
      label: "Audit Trail",
      to: "/audit-logs",
      icon: Activity,
      permission: "audit:read",
    },
  ];

  const filteredItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-4 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Navigasi Utama
      </div>
      <nav className="space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium min-h-11 transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
