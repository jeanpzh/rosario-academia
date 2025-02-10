"use client";
import { Pencil } from "lucide-react";
import React from "react";
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
import AthleteForm from "./AthleteForm";
import { AthleteFormData, athleteFormSchema } from "@/app/dashboard/schemas/athlete-schema";
import { Button } from "../../../../components/ui/button";

interface AthleteManageProps {
  onClick: () => void;
  modalId: string;
}

export default function AthleteManage({ onClick, modalId }: AthleteManageProps) {
  const { modalOpen, modalId: currentModalId, setModalOpen } = useModalStore();
  const methods = useForm<AthleteFormData>({
    resolver: zodResolver(athleteFormSchema),
  });

  const isOpen = modalOpen && currentModalId === modalId;

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setModalOpen(modalId, open);
        }}
      >
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              onClick();
              setModalOpen(modalId, true);
            }}
            className="flex items-center"
            variant={"ghost"}
          >
            <Pencil className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar deportista</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <AthleteForm />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
