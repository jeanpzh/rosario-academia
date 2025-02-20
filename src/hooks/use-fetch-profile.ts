import { getProfile } from "@/app/(auth-pages)/actions";
import { useQuery } from "@tanstack/react-query";

export function useFetchProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    staleTime: 1000 * 60 * 5,
  });
}
