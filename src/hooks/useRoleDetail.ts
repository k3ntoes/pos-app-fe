import { rolesApi } from "@/api/roles";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function useRoleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: role,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["role", id],
    queryFn: () => rolesApi.getRoleById(id as string),
    enabled: Boolean(id),
  });

  return {
    id,
    role,
    isLoading,
    error,
    navigate,
  };
}
