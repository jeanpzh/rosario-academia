import { getPaymentDate } from "@/app/dashboard/actions/athleteActions";
import { useQuery } from "@tanstack/react-query";

export function useFetchPaymentDateQuery() {
  return useQuery({
    queryKey: ["paymentDate"],
    queryFn: getPaymentDate,
    staleTime: 1000 * 60 * 5,
  });
}
