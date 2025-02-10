import TextField from "@/app/(auth-pages)/components/TextField";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { AssistantFormData } from "../../schemas/assistant-schema";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assistantSignUpAction,
  updateAssistantAction,
} from "@/app/dashboard/actions/assistantActions";
import { useToast } from "@/hooks/use-toast";

export default function AssistantForm() {
  const { mode, currentItem, entity, setModalOpen, id } = useModalStore();
  const { control, reset, handleSubmit } = useFormContext<AssistantFormData>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For Assistant Sign Up from Table
  const postMutation = useMutation({
    mutationFn: async (data: AssistantFormData) => {
      return assistantSignUpAction(data);
    },
    onSuccess: () => {
      // if success, refetch the data
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
      // Open Modal
      setModalOpen("assistant-modal", false);
    },
  });
  // For PUT request, update Assistant
  const updateMutation = useMutation({
    mutationFn: async (data: AssistantFormData) => {
      return updateAssistantAction(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
      setModalOpen("assistant-modal", false);
    },
  });

  const onSubmit = async (data: AssistantFormData) => {
    try {
      if (mode === "create") postMutation.mutate(data);
      else if (mode === "edit") updateMutation.mutate(data);
    } catch (error) {
      // Handle error with toast
      toast({
        title: "Error",
        description: "Hubo un problema al guardar los datos. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Render fields based on mode -> "create" | "edit"
  useEffect(() => {
    if (mode === "create") {
      reset({
        first_name: "",
        paternal_last_name: "",
        maternal_last_name: "",
        birth_date: "",
        dni: "",
        phone: "",
        email: "",
      });
    } else if (mode === "edit" && currentItem && entity === "assistant") {
      // if mode is edit, set the fields with the current item data
      const assistant = currentItem as AssistantFormData;
      reset({
        first_name: assistant.first_name,
        paternal_last_name: assistant.paternal_last_name,
        maternal_last_name: assistant.maternal_last_name,
        birth_date: assistant.birth_date,
        dni: assistant.dni,
        phone: assistant.phone,
        email: assistant.email,
      });
    }
  }, [mode, reset, currentItem, entity]);
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
        placeholder="Fecha de Nacimiento"
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
        disabled={mode === "edit"}
      />
      <Button type="submit" className="col-span-2">
        Guardar
      </Button>
    </form>
  );
}
