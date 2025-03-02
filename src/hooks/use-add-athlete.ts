import { addAthlete } from "@/app/dashboard/actions/athleteActions";
import { AthleteFormData } from "@/app/dashboard/schemas/athlete-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAddAthleteMutation = ({ setModalOpen }: { setModalOpen: any }) => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addAthlete"],
    mutationFn: async (variables: { data: AthleteFormData; file: Blob | null }) => {
      return addAthlete(variables.data, variables.file);
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      setModalOpen("athlete-modal", false);
      // title -> Deportista registrado con exito
      // description -> ¿El deportista hizo algun pago?
      // action -> Si, No
      // action -> Si -> redirigir a la pagina de pagos
      // action -> No ->cerrar
      toast.success("Deportista registrado con éxito", {
        description: "¿El deportista hizo algún pago?",
        action: {
          label: "Si",
          onClick: () => {
            push(`/dashboard/auxiliar/athlete-control/payments/${user.data?.id}`);
          },
        },
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
