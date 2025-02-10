"use client";

import { useFormContext } from "react-hook-form";
import TextField from "@/app/(auth-pages)/components/TextField";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/lib/stores/useModalStore";
import type { AthleteFormData } from "@/app/dashboard/schemas/athlete-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { useEffect } from "react";

export default function AthleteForm() {
  const { currentItem, setModalOpen, id } = useModalStore();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext<AthleteFormData>();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: AthleteFormData) => {
      return updateAthleteAction(data, id);
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      setModalOpen("athlete-modal", false);
    },
  });

  const onSubmit = async (data: AthleteFormData) => {
    try {
      updateMutation.mutate(data);
    } catch (error) {
      console.log({ error });
    }
  };
  console.log(errors);
  useEffect(() => {
    const athlete = currentItem as AthleteFormData;
    reset({
      first_name: athlete.first_name,
      paternal_last_name: athlete.paternal_last_name,
      maternal_last_name: athlete.maternal_last_name,
      birth_date: athlete.birth_date,
      dni: athlete.dni,
      phone: athlete.phone,
      email: athlete.email,
      avatar_url: athlete.avatar_url,
    });
  }, [currentItem, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      <TextField
        label="Nombre"
        placeholder="Nombre"
        control={control}
        name="first_name"
        htmlFor="first_name"
      />
      <TextField
        label="Apellido Paterno"
        placeholder="Apellido Paterno"
        control={control}
        name="paternal_last_name"
        htmlFor="paternal_last_name"
      />
      <TextField
        label="Apellido Materno"
        placeholder="Apellido Materno"
        control={control}
        name="maternal_last_name"
        htmlFor="maternal_last_name"
      />
      <TextField
        label="Fecha de Nacimiento"
        placeholder="YYYY-MM-DD"
        control={control}
        name="birth_date"
        htmlFor="birth_date"
        type="date"
      />
      <TextField label="DNI" placeholder="DNI" control={control} name="dni" htmlFor="dni" />
      <TextField
        label="Teléfono"
        placeholder="Teléfono"
        control={control}
        name="phone"
        htmlFor="phone"
      />
      <TextField
        label="Correo Electrónico"
        placeholder="Correo Electrónico"
        control={control}
        name="email"
        htmlFor="email"
      />
      <TextField
        label="URL de Avatar"
        placeholder="Avatar URL"
        control={control}
        name="avatar_url"
        htmlFor="avatar_url"
      />
      <Button type="submit">Guardar</Button>
    </form>
  );
}
