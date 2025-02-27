"use client";
import Header from "@/app/dashboard/components/Header";
import CustomTable from "@/app/dashboard/components/CustomTable";
import { athleteColumns } from "@/lib/columns/athlete-columns";
import { levelColors, statusColors } from "@/utils/table";
import { useModalStore } from "@/lib/stores/useModalStore";
import { Athlete } from "@/lib/types/AthleteTable";
import { useFetchAthletesQuery } from "@/hooks/use-fetch-athletes";
import { useDeleteAthleteQuery } from "@/hooks/use-delete-athlete";
import { useUpdateAthleteStatus } from "@/hooks/use-update-athlete-status";
import { useUpdateAthleteLevel } from "@/hooks/use-update-athlete-level";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import AthleteForm from "@/app/dashboard/components/athletes/AthleteForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { AthleteFormData, athleteFormSchema } from "@/app/dashboard/schemas/athlete-schema";

export default function AthleteControl() {
  const { setModalOpen, setMode, setCurrentItem, setEntity, modalOpen } = useModalStore();

  // Fetch athletes data
  const { data: athletes = [], isLoading } = useFetchAthletesQuery();

  // Delete and update mutations
  const deleteMutation = useDeleteAthleteQuery();
  const updateAthleteStatusMutation = useUpdateAthleteStatus();
  const updateAthleteLevelMutation = useUpdateAthleteLevel();

  const methods = useForm<AthleteFormData>({
    resolver: zodResolver(athleteFormSchema),
  });

  // Handle edit action for athletes (actualiza el estado del modal y el atleta en edición)
  const handleEdit = (athlete: Athlete) => {
    athlete.birth_date = new Date(athlete.birth_date).toISOString().split("T")[0];
    setEntity("athlete");
    setMode("edit");
    setCurrentItem(athlete);
    setModalOpen("athlete-modal", true);
  };

  // Handle delete action
  const handleDelete = (athlete: Athlete) => {
    deleteMutation.mutate(athlete.id);
  };

  return (
    <div className="dark:bg-dark-surface flex flex-col gap-4 bg-background p-4">
      <Header title="Control de Deportistas" />
      <CustomTable
        columns={athleteColumns(
          handleEdit,
          handleDelete,
          updateAthleteLevelMutation,
          updateAthleteStatusMutation,
          levelColors,
          statusColors,
        )}
        data={athletes}
        isLoading={isLoading}
      />

      {/* Modal de edición centralizado */}
      <Dialog open={modalOpen && true} onOpenChange={(open) => setModalOpen("athlete-modal", open)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar deportista</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <AthleteForm />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
