"use server";
import { createClient } from "@/utils/supabase/server";
import { editFormSchema } from "./schemas/edit-form-schema";

type ActionResponse = {
  status: number;
  message: string;
};

export const editProfileAction = async (data: unknown): Promise<ActionResponse> => {
  try {
    const validatedData = editFormSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        status: 400,
        message: "Datos ingresados incorrectos",
      };
    }

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return {
        status: 404,
        message: "Usuario no encontrado",
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: validatedData.data.firstName,
        paternal_last_name: validatedData.data.paternalLastName,
        maternal_last_name: validatedData.data.maternalLastName,
        phone: validatedData.data.phone,
      })
      .eq("id", userData.user.id)
      .single();

    if (error) {
      return {
        status: 500,
        message: error.message,
      };
    }

    return {
      status: 200,
      message: "Perfil actualizado correctamente",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error interno del servidor",
    };
  }
};
