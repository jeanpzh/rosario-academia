"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { editFormSchema, TEditForm } from "@/app/dashboard/athlete/schemas/edit-form-schema";
import EditField from "@/app/dashboard/athlete/components/EditField";
import { Clock, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CardSkeleton from "@/app/dashboard/components/CardSkeleton";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import { useFetchLastProfileUpdateQuery } from "@/hooks/use-fetch-last-profile-update";

interface EditProfileFormProps {
  defaultValues: TEditForm;
  onSubmit: (data: TEditForm) => Promise<void>;
  isEditing: boolean;
  isSaving: boolean;
  onCancelEdit: () => void;
  user: any;
  userProfile: any;
}

export function EditProfileForm({
  defaultValues,
  onSubmit,
  isEditing,
  isSaving,
  onCancelEdit,
  user,
  userProfile,
}: EditProfileFormProps) {
  const { control, handleSubmit, reset, watch } = useForm<TEditForm>({
    resolver: zodResolver(editFormSchema),
    defaultValues,
  });
  const { athlete, setDaysRemaining } = useAthleteStore();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

  const { error: lastProfileUpdateError, isLoading: lastProfileUpdateLoading } =
    useFetchLastProfileUpdateQuery({ setDaysRemaining });

  // Leemos el valor de días restantes desde el estado global
  const daysRemaining = athlete?.profile?.days_remaining || 0;

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

  if (lastProfileUpdateLoading) return <CardSkeleton />;
  if (lastProfileUpdateError) return null;

  return (
    <>
      <form className="flex flex-col gap-4 p-8">
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
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="w-full"
                  variant="default"
                  disabled={!hasChanges || isSaving || daysRemaining > 0}
                >
                  <User className="mr-2 size-4" /> Actualizar Perfil
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Actualización de Perfil</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que quieres editar tu perfil? No podrás cambiarlo durante 1
                    mes.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsConfirmDialogOpen(false);
                      handleCancel();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    variant="default"
                    onClick={async () => {
                      setIsConfirmDialogOpen(false);
                      await handleSubmit(onSubmit)();
                    }}
                  >
                    Confirmar Edición
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="w-full" onClick={handleCancel}>
              <X className="mr-2 size-4" /> Cancelar
            </Button>
          </div>
        )}
      </form>

      {daysRemaining > 0 && (
        <div className="mt-4 flex items-center space-x-2 rounded-lg bg-muted p-4">
          <Clock className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Faltan{" "}
            <span className="font-semibold">
              {daysRemaining} {daysRemaining === 1 ? "día" : "días"}
            </span>{" "}
            para poder editar tu perfil nuevamente.
          </p>
        </div>
      )}
    </>
  );
}
