"use server";
import { getServiceClient } from "@/utils/supabase/server";

import { athleteFormSchema } from "@/app/dashboard/schemas/athlete-schema";

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
  console.log(id);
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
