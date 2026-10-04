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
import { useChangePasswordForm } from "@/hooks/useChangePasswordForm";
import type React from "react";

export const ChangePasswordPage: React.FC = () => {
  const { form, isSubmitting, mustChangePassword, onSubmit } = useChangePasswordForm();
  const {
    register,
    formState: { errors },
  } = form;

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
        <form onSubmit={onSubmit}>
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
