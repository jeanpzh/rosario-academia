import { getAthletesAction } from "@/app/dashboard/actions/athleteActions";
import { Athlete } from "@/lib/types/AthleteTable";
import { useQuery } from "@tanstack/react-query";

export function useFetchAthletesQuery() {
  return useQuery<Athlete[]>({
    queryKey: ["athletes"],
    queryFn: getAthletesAction,
    staleTime: 1000 * 60 * 5,
  });
}
