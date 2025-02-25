import { assistantSignUpAction } from "@/app/dashboard/actions/assistantActions";
import { AssistantFormData } from "@/app/dashboard/admin/schemas/assistant-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddAssistantQuery({ setModalOpen }: { setModalOpen: any }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AssistantFormData) => {
      const response = toast.promise(
        (async () => {
          const res = await assistantSignUpAction(data);
          if ("status" in res && res.status !== 200) {
            throw new Error(res?.message || "Error al registrar el auxiliar");
          }
          return res;
        })(),
        {
          loading: "Registrando auxiliar...",
          success: "El auxiliar administrativo fue registrado con éxito.",
          error: (err: any) => err?.message || "Error al registrar el auxiliar",
        },
      );
      return response.unwrap();
    },
    onSuccess: (newData) => {
      // Solo se cierra el modal si la operación fue exitosa
      /* queryClient.setQueryData(["assistants"], (oldData: any[] = []) => {
        console.log(newData, oldData);
        return [...oldData, newData];
      }); */
      queryClient.invalidateQueries({ queryKey: ["assistants"] });

      setModalOpen("assistant-modal", false);
    },
    onError: (error: any) => {
      console.error(error);
      // En caso de error, el modal permanece abierto para corregir la información
    },
  });
}
