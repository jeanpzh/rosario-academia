"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { changePassword } from "@/app/dashboard/actions/assistantActions";
import { changePasswordFormData, ChangePasswordFormData } from "../schemas/change-password-schema";
import TextField from "@/app/(auth-pages)/components/TextField";

export function ChangePasswordForm() {
  const { handleSubmit, reset, control } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormData),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      const { success, message } = await changePassword(data.currentPassword, data.newPassword);
      if (!success) {
        toast({ title: "Error", description: message, variant: "destructive" });
        return;
      }
      toast({ title: "Éxito", description: message, variant: "default" });
      reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar tu contraseña. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField
        label="Contraseña Actual"
        type="Password"
        control={control}
        id="currentPassword"
        name="currentPassword"
        htmlFor="currentPassword"
      />
      <TextField
        label="Nueva Contraseña"
        type="Password"
        control={control}
        id="newPassword"
        name="newPassword"
        htmlFor="newPassword"
      />
      <TextField
        label="Confirmar Contraseña"
        type="Password"
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
