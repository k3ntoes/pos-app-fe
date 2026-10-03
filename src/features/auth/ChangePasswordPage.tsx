import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ChangePasswordFormData, changePasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ChangePasswordPage: React.FC = () => {
  const { changePassword, mustChangePassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Ubah Password</CardTitle>
          <CardDescription className="text-gray-600">
            {mustChangePassword
              ? "Anda wajib mengubah password default Anda sebelum melanjutkan ke aplikasi."
              : "Masukkan password saat ini dan password baru Anda."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Password Saat Ini</Label>
              <Input
                id="current_password"
                type="password"
                placeholder="••••••••"
                {...register("current_password")}
                aria-invalid={errors.current_password ? "true" : "false"}
              />
              {errors.current_password && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.current_password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password">Password Baru</Label>
              <Input
                id="new_password"
                type="password"
                placeholder="••••••••"
                {...register("new_password")}
                aria-invalid={errors.new_password ? "true" : "false"}
              />
              {errors.new_password && (
                <p className="text-xs text-red-600 font-medium">{errors.new_password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="••••••••"
                {...register("confirm_password")}
                aria-invalid={errors.confirm_password ? "true" : "false"}
              />
              {errors.confirm_password && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
