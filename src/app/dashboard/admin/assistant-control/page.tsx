"use client";
import React, { useState } from "react";
import Header from "@/app/dashboard/components/Header";
import AssistantManage from "@/app/dashboard/admin/assistant-control/components/AssistantManage";
import CustomTable from "@/app/dashboard/components/CustomTable";
import { columns } from "@/lib/columns/assitant-column";
import { Assistant } from "@/lib/types/AssistantTable";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useAssistantQuery } from "@/hooks/use-fetch-assistant-query";
import { useDeleteAssistant } from "@/hooks/use-delete-assistant-query";

export default function AssistantControlPage() {
  // State for delete Modal
  const [isOpen, setIsOpen] = useState(false);

  // Global State for Edit or Create Modal and current item for Assistant
  const { setModalOpen, setMode, setEntity, setCurrentItem, setId } = useModalStore();

  // Fetch Assistants
  const { data: assistants = [], isLoading } = useAssistantQuery();
  // Delete assistant mutation
  const deleteMutation = useDeleteAssistant();
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
