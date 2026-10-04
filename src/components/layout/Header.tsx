import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/AuthContext";
import { KeyRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UnitSwitcher } from "./UnitSwitcher";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-1">
              <Avatar fallback={user.name ? user.name.charAt(0).toUpperCase() : "U"} />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  {user.name || user.username}
                </p>
                <div className="flex items-center space-x-1.5 mt-1">
                  <Badge variant="secondary" className="text-[10px] py-0">
                    {user.role?.name || (user.is_super_admin ? "Super Admin" : "Staff")}
                  </Badge>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    {user.email || user.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/change-password")}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Ubah Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
