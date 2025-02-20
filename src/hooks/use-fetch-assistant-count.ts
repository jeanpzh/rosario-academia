import { getAssistantCount } from "@/app/dashboard/actions/assistantActions";
import { useQuery } from "@tanstack/react-query";

export function useCountAssistantQuery() {
  return useQuery({
    queryKey: ["assistantsCount"],
    queryFn: getAssistantCount,
    staleTime: 1000 * 60 * 5,
  });
}
