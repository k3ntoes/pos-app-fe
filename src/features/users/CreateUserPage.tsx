import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateUser } from "@/hooks/useCreateUser";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { TemporaryPasswordModal } from "./TemporaryPasswordModal";

export function CreateUserPage() {
  const {
    register,
    handleSubmit,
    errors,
    fields,
    append,
    remove,
    units,
    roles,
    createdUserData,
    handleCloseModal,
  } = useCreateUser();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tambah User Baru</h1>
          <p className="text-sm text-gray-500">
            Buat akun user baru dan tentukan penugasan unit serta role.
          </p>
        </div>
        <Link
          to="/users"
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2",
            "min-h-11",
          )}
        >
          Kembali
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="create-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <Input id="create-name" {...register("full_name")} placeholder="Contoh: Budi Santoso" />
            {errors.full_name && (
              <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="create-username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <Input
              id="create-username"
              {...register("username")}
              placeholder="Contoh: budisantoso"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="create-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="create-email"
              type="email"
              {...register("email")}
              placeholder="Contoh: budi@pos.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Penugasan Unit & Role</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ unit_id: "", role_id: "" })}
            >
              + Tambah Penugasan
            </Button>
          </div>
          {errors.unit_role_assignments && (
            <p className="mb-2 text-xs text-red-600">{errors.unit_role_assignments.message}</p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-end gap-3 p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex-1">
                  <label
                    htmlFor={`unit-${index}`}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Unit
                  </label>
                  <Select
                    id={`unit-${index}`}
                    {...register(`unit_role_assignments.${index}.unit_id` as const)}
                  >
                    <option value="">Pilih Unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </Select>
                  {errors.unit_role_assignments?.[index]?.unit_id && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.unit_role_assignments[index]?.unit_id?.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <label
                    htmlFor={`role-${index}`}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <Select
                    id={`role-${index}`}
                    {...register(`unit_role_assignments.${index}.role_id` as const)}
                  >
                    <option value="">Pilih Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Select>
                  {errors.unit_role_assignments?.[index]?.role_id && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.unit_role_assignments[index]?.role_id?.message}
                    </p>
                  )}
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    Hapus
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            to="/users"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm h-11 px-4 py-2"
          >
            Batal
          </Link>
          <Button type="submit">Simpan User</Button>
        </div>
      </form>

      {createdUserData && (
        <TemporaryPasswordModal
          open={Boolean(createdUserData)}
          userName={createdUserData.name}
          temporaryPassword={createdUserData.temporary_password}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
