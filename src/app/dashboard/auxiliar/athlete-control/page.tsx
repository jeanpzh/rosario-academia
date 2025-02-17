"use client";

import { athleteColumns } from "@/lib/columns/athlete-columns";
import { levelColors, statusColors } from "@/utils/table";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Athlete } from "@/lib/types/AthleteTable";
import {
  deleteAthleteAction,
  getAthletesAction,
  updateLevelAthleteAction,
  updateStatusAthleteAction,
} from "@/app/dashboard/actions/athleteActions";
import { useState } from "react";
import CustomTable from "@/app/dashboard/components/CustomTable";
import Header from "@/app/dashboard/components/Header";
import { toast } from "sonner";

export default function AthletePage() {
  const [isOpen, onOpenChange] = useState(false);

  const { setModalOpen, setMode, setCurrentItem, setEntity, setId } = useModalStore();
  const queryClient = useQueryClient();
  const { data: athletes = [], isLoading } = useQuery<Athlete[]>({
    queryKey: ["athletes"],
    queryFn: getAthletesAction,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAthleteAction,
    onSuccess: () => {
      toast.success("Exito", {
        description: "Deportista eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });

  const updateAthleteStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" | "pending" }) =>
      updateStatusAthleteAction(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });

  const updateAthleteLevelMutation = useMutation({
    mutationFn: ({ id, level }: { id: string; level: "beginner" | "intermediate" | "advanced" }) =>
      updateLevelAthleteAction(id, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });

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
