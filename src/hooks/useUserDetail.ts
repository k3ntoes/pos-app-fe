import { usersApi } from "@/api/users";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function useUserDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.getUserById(id || ""),
    enabled: Boolean(id),
  });

  return {
    id,
    user,
    isLoading,
    error,
  };
}
