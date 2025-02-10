"use client";
import Header from "../../components/Header";
import CustomTable from "../../components/CustomTable";
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

export default function AthletePage() {
  const [isOpen, onOpenChange] = useState(false);

  const { setModalOpen, setMode, setCurrentItem, setEntity, setId } = useModalStore();
  const queryClient = useQueryClient();

  // Fetch athletes data from the server with server action
  const { data: athletes = [], isLoading } = useQuery<Athlete[]>({
    queryKey: ["athletes"],
    queryFn: getAthletesAction,
  });

  // Delete mutation for athletes with server action
  const deleteMutation = useMutation({
    mutationFn: deleteAthleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });
  // Update athlete status mutation
  const updateAthleteStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" | "pending" }) =>
      updateStatusAthleteAction(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });
  // Update athlete level mutation
  const updateAthleteLevelMutation = useMutation({
    mutationFn: ({ id, level }: { id: string; level: "beginner" | "intermediate" | "advanced" }) =>
      updateLevelAthleteAction(id, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });

  // Handle edit action for athletes
  const handleEdit = (athlete: Athlete) => {
    athlete.birth_date = new Date(athlete.birth_date).toISOString().split("T")[0];
    setEntity("athlete");
    setMode("edit");
    setCurrentItem(athlete);
    setId(athlete.id);
    setModalOpen("athlete-modal", true);
  };
  // Handle delete action for athletes
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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
