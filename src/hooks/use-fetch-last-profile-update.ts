import { getLastProfileUpdateDate } from "@/app/dashboard/actions/athleteActions";
import { getDaysRemaining } from "@/utils/formats";
import { useQuery } from "@tanstack/react-query";

export function useFetchLastProfileUpdateQuery({
  setDaysRemaining,
}: {
  setDaysRemaining: (days: number) => void;
}) {
  return useQuery({
    queryKey: ["last-profile-update"],
    queryFn: async () => {
      const res = await getLastProfileUpdateDate();
      const daysRemaining = getDaysRemaining(res.data);
      // Actualizamos el estado global con los días restantes
      setDaysRemaining(daysRemaining);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
