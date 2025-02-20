import { updateAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { AthleteFormData } from "@/app/dashboard/schemas/athlete-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAthleteMutation({ setModalOpen, id }: { setModalOpen: any; id: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AthleteFormData) => {
      return updateAthleteAction(data, id);
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      setModalOpen("athlete-modal", false);
    },
  });
}
