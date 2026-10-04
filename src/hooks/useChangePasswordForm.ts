import { useAuth } from "@/features/auth/AuthContext";
import { type ChangePasswordFormData, changePasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function useChangePasswordForm() {
  const { changePassword, mustChangePassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsSubmitting(true);
      await changePassword(data);
      navigate("/", { replace: true });
    } catch {
      // error handled in AuthContext via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    mustChangePassword,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
