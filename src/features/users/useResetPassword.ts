import { usersApi } from "@/api/users";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

export interface ResetPasswordTarget {
  id: string;
  name: string;
}

export interface ResetPasswordSuccessData {
  temporaryPassword: string;
  userName: string;
}

export function useResetPassword() {
  const [confirmUser, setConfirmUser] = React.useState<ResetPasswordTarget | null>(null);
  const [successData, setSuccessData] = React.useState<ResetPasswordSuccessData | null>(null);

  const resetMutation = useMutation({
    mutationFn: (userId: string) => usersApi.resetPassword(userId),
    onSuccess: (data) => {
      setSuccessData({
        temporaryPassword: data.temporary_password,
        userName: confirmUser?.name || "User",
      });
      setConfirmUser(null);
      toast.success("Password user berhasil direset");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gagal mereset password user");
      setConfirmUser(null);
    },
  });

  const triggerReset = (user: ResetPasswordTarget) => {
    setConfirmUser(user);
  };

  const confirmReset = () => {
    if (confirmUser) {
      resetMutation.mutate(confirmUser.id);
    }
  };

  const cancelReset = () => {
    setConfirmUser(null);
  };

  const closeSuccessModal = () => {
    setSuccessData(null);
  };

  return {
    confirmUser,
    successData,
    isResetting: resetMutation.isPending,
    triggerReset,
    confirmReset,
    cancelReset,
    closeSuccessModal,
  };
}
