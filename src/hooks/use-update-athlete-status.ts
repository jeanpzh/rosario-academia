import { updateStatusAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAthleteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" | "pending" }) =>
      updateStatusAthleteAction(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });
}
