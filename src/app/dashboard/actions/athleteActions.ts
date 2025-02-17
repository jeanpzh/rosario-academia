"use server";
import { createClient, getServiceClient } from "@/utils/supabase/server";

import { athleteFormSchema } from "@/app/dashboard/schemas/athlete-schema";

import { v4 as uuidv4 } from "uuid";

export const updateAthleteAction = async (formData: unknown, id: string) => {
  const validatedData = athleteFormSchema.safeParse(formData);
  if (validatedData.error)
    return {
      error: "Datos ingresados incorrectos",
    };
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: validatedData.data.first_name,
      paternal_last_name: validatedData.data.paternal_last_name,
      maternal_last_name: validatedData.data.maternal_last_name,
      birth_date: validatedData.data.birth_date,
      dni: validatedData.data.dni,
      phone: validatedData.data.phone,
      email: validatedData.data.email,
      avatar_url: validatedData.data.avatar_url,
    } as any)
    .eq("id", id);
  if (error) throw new Error("Error al actualizar deportista");
  return data;
};

export const deleteAthleteAction = async (id: string) => {
  const supabase = await getServiceClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw new Error("Error al eliminar deportista");
  return { status: 200, message: "Deportista eliminado correctamente" };
};

export const getAthletesAction = async () => {
  const supabase = await getServiceClient();
  const { data, error } = await supabase.rpc("get_deportistas");
  if (error) throw new Error("Error al obtener deportistas");
  console.log(data.length);
  return data;
};
export const updateStatusAthleteAction = async (id: string, status: string) => {
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("enrollment_requests")
    .update({ status })
    .eq("athlete_id", id);
  if (error) {
    console.log("Error updating status", error);
    return;
  }
  return data;
};

export const updateLevelAthleteAction = async (id: string, level: string) => {
  const supabase = await getServiceClient();
  const { data, error } = await supabase.from("athletes").update({ level }).eq("athlete_id", id);
  if (error) {
    console.log("Error updating level", error);
    return;
  }
  return data;
};
export const getAthletesCount = async () => {
  const supabase = await getServiceClient();
  const { data, error } = await supabase.from("profiles").select("id").eq("role", "deportista");
  if (error) throw new Error("Error al obtener el conteo de deportistas");
  return data.length;
};
export const getAthleteDistribution = async () => {
  const supabase = await getServiceClient();
  const { data, error } = await supabase.from("athletes").select("level");
  if (error) throw new Error("Error al obtener la distribución de deportistas");
  const levels = data.map((athlete: any) => athlete.level);
  const beginner = levels.filter((level: string) => level === "beginner").length;
  const intermediate = levels.filter((level: string) => level === "intermediate").length;
  const advanced = levels.filter((level: string) => level === "advanced").length;
  return { beginner, intermediate, advanced };
};

/* ------------ */
export const generateVerificationCode = async () => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) return { status: 500, error: "Error al obtener usuario" };

  const athleteId = user.user.id;

  // Verify if verification_id already exists
  const { data: athlete, error: athleteError } = await supabase
    .from("athletes")
    .select("verification_id")
    .eq("athlete_id", athleteId)
    .single();

  if (athleteError) return { status: 500, error: "Error al obtener datos del deportista" };

  // if verification_id already exists, return it
  if (athlete.verification_id) return { status: 200, data: athlete.verification_id };

  // Generate verification_id if it doesn't exist and update athlete
  const verification_id = uuidv4();
  const { error } = await supabase
    .from("athletes")
    .update({ verification_id: verification_id })
    .eq("athlete_id", athleteId);

  if (error) return { status: 500, error: "Error al generar código de verificación" };
  return { status: 200, data: verification_id };
};
export const getPaymentDate = async () => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) return { status: 500, error: "Error al obtener usuario" };

  const athleteId = user.user.id;

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("payment_date")
    .eq("athlete_id", athleteId)
    .single();

  if (paymentError) return { status: 500, error: "Error al obtener datos de pago" };

  return { status: 200, data: payment.payment_date };
};
