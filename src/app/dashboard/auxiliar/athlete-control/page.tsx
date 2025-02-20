"use client";

import { athleteColumns } from "@/lib/columns/athlete-columns";
import { levelColors, statusColors } from "@/utils/table";
import { useModalStore } from "@/lib/stores/useModalStore";
import { Athlete } from "@/lib/types/AthleteTable";
import { useState } from "react";
import CustomTable from "@/app/dashboard/components/CustomTable";
import Header from "@/app/dashboard/components/Header";
import { useFetchAthletesQuery } from "@/hooks/use-fetch-athletes";
import { useDeleteAthleteQuery } from "@/hooks/use-delete-athlete";
import { useUpdateAthleteStatus } from "@/hooks/use-update-athlete-status";
import { useUpdateAthleteLevel } from "@/hooks/use-update-athlete-level";

export default function AthletePage() {
  const [isOpen, onOpenChange] = useState(false);

  const { setModalOpen, setMode, setCurrentItem, setEntity, setId } = useModalStore();
  const { data: athletes = [], isLoading } = useFetchAthletesQuery();

  const deleteMutation = useDeleteAthleteQuery();

  const updateAthleteStatusMutation = useUpdateAthleteStatus();

  const updateAthleteLevelMutation = useUpdateAthleteLevel();

  const handleEdit = (athlete: Athlete) => {
    athlete.birth_date = new Date(athlete.birth_date).toISOString().split("T")[0];
    setEntity("athlete");
    setMode("edit");
    setCurrentItem(athlete);
    setId(athlete.id);
    setModalOpen("athlete-modal", true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteMutation.mutate(id);
    } catch (error) {
      console.log(error);
    }
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
          isOpen,
          () => onOpenChange(!isOpen),
        )}
        data={athletes}
        isLoading={isLoading}
      />
    </div>
  );
}
