import { getAthletesCount } from "@/app/dashboard/actions/athleteActions";
import { useQuery } from "@tanstack/react-query";

export function useCountAthletesQuery() {
  return useQuery({
    queryKey: ["athletesCount"],
    queryFn: getAthletesCount,
    staleTime: 1000 * 60 * 5,
  });
}
