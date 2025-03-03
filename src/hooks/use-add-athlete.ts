import { addAthlete } from "@/app/dashboard/actions/athleteActions";
import { AthleteFormData } from "@/app/dashboard/schemas/athlete-schema";
import { useAthleteModalStore } from "@/lib/stores/useAthleteStore";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAddAthleteMutation = () => {
  const { closeModal, setOpenModal } = useModalStore();
  const { setCurrentItem } = useAthleteModalStore();

  const { push } = useRouter();
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
        action: {
          label: "Si",
          onClick: () => {
            // Get the current path to determine if we're in admin or auxiliar section
            const currentPath = window.location.pathname;
            const isAdmin = currentPath.includes("/admin/");

            // Construct the path based on whether we're in admin or auxiliar section
            const basePath = isAdmin ? "/dashboard/admin" : "/dashboard/auxiliar";
            push(`${basePath}/athlete-control/payments/${user.data?.id}`);
          },
        },
      });
    },

    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
};
