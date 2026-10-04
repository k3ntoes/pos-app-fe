import { rolesApi } from "@/api/roles";
import { type UpdateRoleFormValues, updateRoleSchema } from "@/schemas/role";
import type { PermissionType } from "@/types/permission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function useEditRole() {
  const { id } = useParams<{ id: string }>();
  const roleId = id as string;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: role, isLoading: isFetching } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => rolesApi.getRoleById(roleId),
    enabled: Boolean(roleId),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  React.useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions || [],
      });
    }
  }, [role, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdateRoleFormValues) =>
      rolesApi.updateRole(roleId, {
        name: role?.is_system ? undefined : data.name,
        description: data.description,
        permissions: data.permissions as PermissionType[],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", roleId] });
      toast.success("Role berhasil diperbarui");
      navigate("/roles");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal memperbarui role");
    },
  });

  const onSubmit = (data: UpdateRoleFormValues) => {
    mutation.mutate(data);
  };

  return {
    roleId,
    role,
    isFetching,
    register,
    control,
    handleSubmit,
    errors,
    mutation,
    onSubmit,
    navigate,
  };
}
