import { updateAssistantAction } from "@/app/dashboard/actions/assistantActions";
import { AssistantFormData } from "@/app/dashboard/admin/schemas/assistant-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateAssistant({ setModalOpen, id }: { setModalOpen: any; id: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AssistantFormData) => {
      const res = toast.promise(
        (async () => {
          const response = await updateAssistantAction(data, id);
          if ("status" in response && response.status !== 200) {
            throw new Error(response?.message || "Error al actualizar el auxiliar");
          }
          return response;
        })(),
        {
          loading: "Actualizando auxiliar...",
          success: "El auxiliar administrativo fue actualizado con éxito.",
          error: (err: any) => err?.message || "Error al actualizar el auxiliar",
        },
      );
      return res.unwrap();
    },
    onSuccess: (updatedAssistant) => {
      queryClient.setQueryData(["assistants"], (oldData: any[] = []) => {
        return oldData.map((assistant) =>
          assistant.id === id ? { ...assistant, ...updatedAssistant } : assistant,
        );
      });
      setModalOpen("assistant-modal", false);
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}
