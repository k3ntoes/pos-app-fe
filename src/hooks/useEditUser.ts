import { type Role, rolesApi } from "@/api/roles";
import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import { type UpdateUserFormValues, updateUserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function useEditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.getUserById(id || ""),
    enabled: Boolean(id),
  });

  const { data: unitsResponse } = useQuery({
    queryKey: ["units"],
    queryFn: () => unitsApi.getUnits(),
  });
  const units = unitsResponse?.units ?? [];

  const { data: rolesData } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: () => rolesApi.getRoles(),
  });
  const roles = rolesData ?? [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      unit_role_assignments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "unit_role_assignments",
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        unit_role_assignments:
          user.unit_role_assignments?.map((a) => ({
            unit_id: a.unit_id,
            role_id: a.role_id,
          })) || [],
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdateUserFormValues) => usersApi.updateUser(id || "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success("User berhasil diperbarui");
      navigate(`/users/${id}`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal memperbarui user");
    },
  });

  const onSubmit = (data: UpdateUserFormValues) => {
    mutation.mutate(data);
  };

  return {
    id,
    user,
    isUserLoading,
    units,
    roles,
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    fields,
    append,
    remove,
    isPending: mutation.isPending,
  };
}
