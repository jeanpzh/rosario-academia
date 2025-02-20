import { generateVerificationCode } from "@/app/dashboard/actions/athleteActions";
import { useMutation } from "@tanstack/react-query";

export function useGenerateVerificationId({
  setVerificationId,
}: {
  setVerificationId: (data: string) => void;
}) {
  return useMutation({
    mutationKey: ["generateVerificationId"],
    mutationFn: generateVerificationCode,
    onSuccess: (data) => {
      if (data.status === 200) setVerificationId(data.data);
    },
  });
}
