import { rolesApi } from "@/api/roles";
import { type CreateRoleFormValues, createRoleSchema } from "@/schemas/role";
import type { PermissionType } from "@/types/permission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useCreateRole() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateRoleFormValues) =>
      rolesApi.createRole({
        name: data.name,
        description: data.description,
        permissions: data.permissions as PermissionType[],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role baru berhasil dibuat");
      navigate("/roles");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal membuat role baru");
    },
  });

  const onSubmit = (data: CreateRoleFormValues) => {
    mutation.mutate(data);
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    mutation,
    onSubmit,
    navigate,
  };
}
