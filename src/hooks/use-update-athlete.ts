import { updateAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { AthleteFormData } from "@/app/dashboard/schemas/athlete-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateAthleteMutation({ setModalOpen, id }: { setModalOpen: any; id: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AthleteFormData) => {
      return toast.promise(updateAthleteAction(data, id), {
        loading: "Actualizando atleta...",
        success: "Atleta actualizado exitosamente",
        error: (err) => `Error al actualizar el atleta: ${err.message}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      setModalOpen("athlete-modal", false);
    },
  });
}
