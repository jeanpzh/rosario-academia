import { deleteAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteAthleteQuery() {
  const queryClient = useQueryClient();

  return useMutation({
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
}
