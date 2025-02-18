"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/app/dashboard/actions/assistantActions";
import {
  changePasswordFormData,
  ChangePasswordFormData,
} from "@/app/dashboard/schemas/change-password-schema";
import PasswordInput from "@/components/password-input";
import VerifyPassword from "@/app/(auth-pages)/components/VerifyPassword";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const { handleSubmit, reset, control, watch } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormData),
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      const { success, message } = await changePassword(data.currentPassword, data.newPassword);
      if (!success) {
        toast.error("Error", {
          description: message,
          duration: 5000,
        });
        return;
      }

      toast.success("Éxito", {
        description: message,
        duration: 5000,
      });
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Hubo un problema al actualizar tu contraseña. Por favor, intenta de nuevo.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PasswordInput
        label="Contraseña Actual"
        control={control}
        id="currentPassword"
        name="currentPassword"
        htmlFor="currentPassword"
      />
      <PasswordInput
        label="Nueva Contraseña"
        control={control}
        id="newPassword"
        name="newPassword"
        htmlFor="newPassword"
      />
      <VerifyPassword password={watch("newPassword", "")} />
      <PasswordInput
        label="Confirmar Contraseña"
        control={control}
        id="confirmPassword"
        name="confirmPassword"
        htmlFor="confirmPassword"
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
      </Button>
    </form>
  );
}
