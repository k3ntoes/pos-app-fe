import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { LogOut } from "lucide-react";
import { UnitSwitcher } from "./UnitSwitcher";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-blue-600 tracking-tight">POS App</span>
        </div>
        <div className="hidden md:block h-6 w-px bg-gray-200" />
        <UnitSwitcher />
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <Avatar fallback={user.name ? user.name.charAt(0).toUpperCase() : "U"} />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-none">
                {user.name || user.username}
              </p>
              <div className="flex items-center space-x-1.5 mt-1">
                <Badge variant="secondary" className="text-[10px] py-0">
                  {user.role?.name || user.is_super_admin ? "Super Admin" : "Staff"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:border-red-200 min-h-[44px]"
          title="Keluar / Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
