import { getAllPaymentData } from "@/app/dashboard/actions/athleteActions";
import { useQuery } from "@tanstack/react-query";

export function usePaymentData() {
  return useQuery({
    queryKey: ["allPaymentData"],
    queryFn: getAllPaymentData,
  });
}
