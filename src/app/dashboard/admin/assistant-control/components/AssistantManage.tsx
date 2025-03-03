"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import {
  type AssistantFormData,
  assistantFormSchema,
} from "@/app/dashboard/admin/schemas/assistant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "@/lib/stores/useModalStore";
import AssistantForm from "@/app/dashboard/admin/assistant-control/components/AssistantForm";
import { HoverBorderGradient } from "@/components/hover-border-gradient";

export default function AssistantManage() {
  const { modalOpen, setModalOpen, setMode, mode, modalId } = useModalStore();
  // For form provider and resolver
  const methods = useForm<AssistantFormData>({
    resolver: zodResolver(assistantFormSchema),
  });
  const handleAddAssistant = () => setMode("create");

  return (
    <div className="mb-4 flex items-center justify-between bg-background p-4 shadow-sm">
      <Dialog
        open={mode === "create" && modalId === "assistant-modal" && modalOpen}
        onOpenChange={(open) => setModalOpen("assistant-modal", open)}
      >
        <DialogTrigger asChild>
          <HoverBorderGradient onClick={handleAddAssistant} className="flex items-center">
            <Plus className="mr-2 size-4" />
            Nuevo Auxiliar Administrativo
          </HoverBorderGradient>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Nuevo Auxiliar Administrativo</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <AssistantForm />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
