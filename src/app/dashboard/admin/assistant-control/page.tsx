"use client";
import React, { useState } from "react";
import Header from "@/app/dashboard/components/Header";
import AssistantManage from "@/app/dashboard/admin/assistant-control/components/AssistantManage";
import CustomTable from "@/app/dashboard/components/CustomTable";
import { columns } from "@/lib/columns/assitant-column";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAssistantAction,
  getAssistantsAction,
} from "@/app/dashboard/actions/assistantActions";
import { Assistant } from "@/lib/types/AssistantTable";
import { useModalStore } from "@/lib/stores/useModalStore";

export default function AssistantControlPage() {
  // State for delete Modal
  const [isOpen, setIsOpen] = useState(false);

  // Global State for Edit or Create Modal and current item for Assistant
  const { setModalOpen, setMode, setEntity, setCurrentItem, setId } = useModalStore();

  const queryClient = useQueryClient();
  // Fetch Assistants
  const { data: assistants = [], isLoading } = useQuery<Assistant[]>({
    queryKey: ["assistants"],
    queryFn: getAssistantsAction,
  });
  // Delete assistant mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAssistantAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
    },
  });
  // Handle Assistant Edit
  const handleEdit = (item: Assistant) => {
    setEntity("assistant");
    setModalOpen("assistant-modal", true);
    setMode("edit");
    item.birth_date = new Date(item.birth_date).toISOString().split("T")[0];
    setCurrentItem(item);
    setId(item.id);
  };
  // Handle Assistant Delete
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="dark:bg-dark-surface flex flex-col gap-4 bg-background p-4">
      <Header title="Control de Auxiliares" />
      <AssistantManage modalId="assistant-modal" />
      <CustomTable
        columns={columns(handleEdit, handleDelete, isOpen, () => setIsOpen(!isOpen))}
        data={assistants}
        isLoading={isLoading}
      />
    </div>
  );
}
