import { updateLevelAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAthleteLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, level }: { id: string; level: "beginner" | "intermediate" | "advanced" }) =>
      updateLevelAthleteAction(id, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });
}
