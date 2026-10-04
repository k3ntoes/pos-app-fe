import { type Role, rolesApi } from "@/api/roles";
import { unitsApi } from "@/api/units";
import { usersApi } from "@/api/users";
import { type CreateUserFormValues, createUserSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export function useCreateUser() {
  const [createdUserData, setCreatedUserData] = React.useState<{
    name: string;
    temporary_password: string;
  } | null>(null);

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
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      unit_role_assignments: [{ unit_id: "", role_id: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "unit_role_assignments",
  });

  const mutation = useMutation({
    mutationFn: (data: CreateUserFormValues) => usersApi.createUser(data),
    onSuccess: (response) => {
      toast.success("User berhasil dibuat");
      setCreatedUserData({
        name: response.full_name || response.name || "",
        temporary_password: response.temporary_password || "TEMP_PASS_123!",
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal membuat user baru");
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    mutation.mutate(data);
  };

  const handleCloseModal = () => {
    setCreatedUserData(null);
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    fields,
    append,
    remove,
    units,
    roles,
    createdUserData,
    isPending: mutation.isPending,
    handleCloseModal,
  };
}
