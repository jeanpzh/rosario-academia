"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { editFormSchema, TEditForm } from "@/app/dashboard/athlete/schemas/edit-form-schema";
import EditField from "@/app/dashboard/athlete/components/EditField";
import { BadgeMessage } from "@/app/dashboard/athlete/components/BadgeMessage";

interface EditProfileFormProps {
  defaultValues: TEditForm;
  onSubmit: (data: TEditForm) => Promise<void>;
  isEditing: boolean;
  isSaving: boolean;
  message: string | null;
  saveStatus: "success" | "error";
  onCancelEdit: () => void;
  user: any;
  userProfile: any;
}

export function EditProfileForm({
  defaultValues,
  onSubmit,
  isEditing,
  isSaving,
  message,
  saveStatus,
  onCancelEdit,
  user,
  userProfile,
}: EditProfileFormProps) {
  const { control, handleSubmit, reset, watch } = useForm<TEditForm>({
    resolver: zodResolver(editFormSchema),
    defaultValues,
  });

  const handleCancel = () => {
    reset(defaultValues);
    onCancelEdit();
  };
  const watchedValues = useWatch({ control });

  const hasChanges =
    JSON.stringify(watchedValues) !==
    JSON.stringify({
      firstName: userProfile?.first_name || "",
      paternalLastName: userProfile?.paternal_last_name || "",
      maternalLastName: userProfile?.maternal_last_name || "",
      phone: userProfile?.phone || "",
    });

  return (
    <form className="flex flex-col gap-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <EditField
          control={control}
          name="firstName"
          label="Nombres"
          disabled={!isEditing}
          value={watch("firstName")}
        />
        <EditField
          control={control}
          name="paternalLastName"
          label="Apellido Paterno"
          disabled={!isEditing}
          value={watch("paternalLastName")}
        />
        <EditField
          control={control}
          name="maternalLastName"
          label="Apellido Materno"
          disabled={!isEditing}
          value={watch("maternalLastName")}
        />
        <EditField
          control={control}
          name="phone"
          label="Teléfono"
          disabled={!isEditing}
          value={watch("phone")}
        />
        <EditField name="email" label="Correo Electrónico" disabled value={user?.email} />
      </div>
      {isEditing && (
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            className="w-full"
            variant="default"
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button variant="outline" onClick={handleCancel} className="w-full">
            Cancelar
          </Button>
        </div>
      )}
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          <BadgeMessage variant={saveStatus} className="mt-4" message={message} />
        </motion.div>
      )}
    </form>
  );
}
