import { addAthlete } from "@/app/dashboard/actions/athleteActions";
import { AthleteFormData } from "@/app/dashboard/schemas/athlete-schema";
import { useAthleteModalStore } from "@/lib/stores/useAthleteStore";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddAthleteMutation = () => {
  const { closeModal, setOpenModal } = useModalStore();
  const { setCurrentItem } = useAthleteModalStore();

  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addAthlete"],
    mutationFn: async (variables: { data: AthleteFormData; file: Blob | null }) => {
      return addAthlete(variables.data, variables.file);
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      closeModal();
      setCurrentItem(user.data);
      setOpenModal("CREATE_PAYMENT");
      toast.success("Deportista registrado con éxito", {
        description: "¿El deportista hizo algún pago?",
      });
    },

    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
};
