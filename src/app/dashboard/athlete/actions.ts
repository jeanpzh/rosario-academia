"use server";
import { createClient } from "@/utils/supabase/server";
import { editFormSchema } from "./schemas/edit-form-schema";
import { MP } from ".";
import { BASE_URL } from "@/lib/config";
import { Preference } from "mercadopago";

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

export const submit = async (id: string) => {
  try {
    const preference = await new Preference(MP).create({
      body: {
        items: [
          {
            id: "1234",
            title: "Pago a Academia Rosario",
            quantity: 1,
            currency_id: "PEN",
            description: "Inscripción a la academia",
            unit_price: 0,
          },
        ],
        metadata: {
          athlete_id: id,
        },
        back_urls: {
          success: `${BASE_URL}/dashboard/athlete/payments`,
          failure: `${BASE_URL}$/failure`,
          pending: `${BASE_URL}$/pending`,
        },
        auto_return: "approved",
      },
    });
    return preference.init_point;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};
