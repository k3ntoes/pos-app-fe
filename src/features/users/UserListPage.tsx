import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { createUserColumns } from "@/features/users/components/userColumns";
import { useResetPassword } from "@/features/users/useResetPassword";
import { useUserList } from "@/hooks/useUserList";
import { Link } from "react-router-dom";
import { ManageUserRolesModal } from "./ManageUserRolesModal";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { TemporaryPasswordModal } from "./TemporaryPasswordModal";
import { UserFilterBar } from "./UserFilterBar";
import { UserStatusModal } from "./UserStatusModal";

export function UserListPage() {
  const {
    page,
    search,
    statusFilter,
    unitFilter,
    statusModalUser,
    manageRolesUser,
    units,
    usersData,
    isLoading,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleStatusChange,
    handleOpenStatusModal,
    handleCloseStatusModal,
    handleOpenManageRolesModal,
    handleCloseManageRolesModal,
  } = useUserList();

  const {
    confirmUser,
    successData,
    isResetting,
    triggerReset,
    confirmReset,
    cancelReset,
    closeSuccessModal,
  } = useResetPassword();

  const columns = createUserColumns({
    onOpenManageRolesModal: handleOpenManageRolesModal,
    onOpenStatusModal: handleOpenStatusModal,
    onTriggerReset: triggerReset,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Users</h1>
          <p className="text-sm text-gray-500">
            Kelola pengguna sistem POS beserta penugasan unit dan role.
          </p>
        </div>
        <Link
          to="/users/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 bg-blue-600 text-white hover:bg-blue-700 shadow h-11 px-4 py-2"
        >
          + Tambah User
        </Link>
      </div>

      <UserFilterBar
        search={search}
        statusFilter={statusFilter}
        unitFilter={unitFilter}
        units={units}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <DataTable
        columns={columns}
        data={usersData?.data || []}
        isLoading={isLoading}
        emptyMessage="Tidak ada user ditemukan."
      />

      {usersData?.meta && usersData.meta.last_page > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500">
            Menampilkan halaman {usersData.meta.current_page} dari {usersData.meta.last_page} (Total{" "}
            {usersData.meta.total} user)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= usersData.meta.last_page}
              onClick={() => handlePageChange(page + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      {statusModalUser && (
        <UserStatusModal
          user={statusModalUser}
          isOpen={Boolean(statusModalUser)}
          onClose={handleCloseStatusModal}
          onConfirm={(status) => handleStatusChange(statusModalUser.id, status)}
        />
      )}

      {manageRolesUser && (
        <ManageUserRolesModal
          open={Boolean(manageRolesUser)}
          userId={manageRolesUser.id}
          userName={manageRolesUser.name || manageRolesUser.full_name}
          onClose={handleCloseManageRolesModal}
        />
      )}

      <ResetPasswordDialog
        open={Boolean(confirmUser)}
        userName={confirmUser?.name}
        isResetting={isResetting}
        onConfirm={confirmReset}
        onClose={cancelReset}
      />

      {successData && (
        <TemporaryPasswordModal
          open={Boolean(successData)}
          temporaryPassword={successData.temporaryPassword}
          userName={successData.userName}
          isReset={true}
          onClose={closeSuccessModal}
        />
      )}
    </div>
  );
}
