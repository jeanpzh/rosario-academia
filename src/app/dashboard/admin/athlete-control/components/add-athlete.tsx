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
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "@/lib/stores/useModalStore";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import AthleteForm from "@/app/dashboard/components/athletes/AthleteForm";
import { addAthleteSchema, AddAthleteSchema } from "../schema";

export default function AddAthlete() {
  const { modalOpen, setModalOpen, setMode } = useModalStore();
  const methods = useForm<AddAthleteSchema>({
    resolver: zodResolver(addAthleteSchema),
  });
  const handleAddAssistant = () => {
    try {
      setMode("create");
      setModalOpen("athlete-modal", true);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="mb-4 flex items-center justify-between bg-background p-4 shadow-sm">
      <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen("", open)}>
        <DialogTrigger asChild>
          <HoverBorderGradient onClick={handleAddAssistant} className="flex items-center">
            <Plus className="mr-2 size-4" />
            Nuevo Deportista
          </HoverBorderGradient>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[700px]">
          <DialogHeader className="z-100 sticky top-0 bg-background">
            <DialogTitle>Nuevo Deportista</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto pb-4">
            <FormProvider {...methods}>
              <AthleteForm />
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
