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
import AssistantForm from "./AssistantForm";
import { HoverBorderGradient } from "@/components/hover-border-gradient";

interface AssistantManageProps {
  modalId: string;
}

export default function AssistantManage({ modalId }: AssistantManageProps) {
  const { modalOpen, setModalOpen, setMode } = useModalStore();
  // For form provider and resolver
  const methods = useForm<AssistantFormData>({
    resolver: zodResolver(assistantFormSchema),
  });

  return (
    <div className="mb-4 flex items-center justify-between bg-background p-4 shadow-sm">
      <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(modalId, open)}>
        <DialogTrigger asChild>
          <HoverBorderGradient onClick={() => setMode("create")} className="flex items-center">
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
