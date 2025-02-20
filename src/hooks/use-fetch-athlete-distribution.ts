import { getAthleteDistribution } from "@/app/dashboard/actions/athleteActions";
import { useQuery } from "@tanstack/react-query";

export function useFetchAthleteDistribution() {
  return useQuery({
    queryKey: ["athleteDistribution"],
    queryFn: getAthleteDistribution,
    staleTime: 1000 * 60 * 5,
  });
}
