import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import type { User, UserStatus } from "@/types/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

interface UserColumnsProps {
  onOpenManageRolesModal: (user: User) => void;
  onOpenStatusModal: (user: User) => void;
  onTriggerReset: (target: { id: string; name: string }) => void;
}

export function createUserColumns({
  onOpenManageRolesModal,
  onOpenStatusModal,
  onTriggerReset,
}: UserColumnsProps): ColumnDef<User>[] {
  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 border-green-200">ACTIVE</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">SUSPENDED</Badge>;
      case "DEACTIVATED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">DEACTIVATED</Badge>;
    }
  };

  return [
    {
      accessorKey: "name",
      header: "Nama / Username",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">@{user.username}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-gray-600">{row.original.email}</span>,
    },
    {
      accessorKey: "unit_role_assignments",
      header: "Penugasan Unit & Role",
      cell: ({ row }) => {
        const assignments = row.original.unit_role_assignments || [];
        return (
          <div className="space-y-1">
            {assignments.map((assignment) => (
              <div
                key={`${assignment.unit_id}-${assignment.role_id}`}
                className="text-xs flex items-center gap-1.5"
              >
                <span className="font-medium text-gray-700">
                  {assignment.unit_name || assignment.unit_id}
                </span>
                <span className="text-gray-400">/</span>
                <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                  {assignment.role_name || assignment.role_id}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "created_at",
      header: "Dibuat",
      cell: ({ row }) => (
        <span className="text-xs text-gray-500">{formatDate(row.original.created_at)}</span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <span className="font-bold">•••</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link to={`/users/${user.id}`} />}>
                  Detail
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link to={`/users/${user.id}/edit`} />}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpenManageRolesModal(user)}>
                  Kelola Role
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpenStatusModal(user)}>
                  Ubah Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onTriggerReset({
                      id: user.id,
                      name: user.name || user.full_name,
                    })
                  }
                >
                  Reset Password
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
