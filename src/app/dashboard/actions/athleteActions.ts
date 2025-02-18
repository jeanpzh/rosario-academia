"use server";

import { createClient, getServiceClient } from "@/utils/supabase/server";
import { athleteFormSchema } from "@/app/dashboard/schemas/athlete-schema";
import { v4 as uuidv4 } from "uuid";
import { getProfile } from "@/app/(auth-pages)/actions";

/**
 * Obtiene el usuario actual desde Supabase.
 * Lanza un error si no se logra obtener el usuario.
 */
export async function getUser(): Promise<any> {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Error al obtener usuario");
  }
  return user.user;
}
/**
 * Obtiene la información de matrícula del deportista.
 */
export async function getEnrollmentAction() {
  const user = await getUser();
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("enrollment_requests")
    .select("*")
    .eq("athlete_id", user.id)
    .single();
  if (error) {
    throw new Error("Error al obtener matrícula de deportista");
  }
  return data;
}
/**
 *
 * @returns  Devuelve los pagos del deportista
 */
export async function getPaymentsAction() {
  const user = await getUser();
  const supabase = await getServiceClient();
  const { data, error } = await supabase.from("payments").select("*").eq("athlete_id", user.id);

  if (error) {
    console.log(error);
    throw new Error("Error al obtener pagos de deportista");
  }
  return data;
}
/**
 * @returns Devuelve la suscripción del deportista
 */

export async function getSubscription() {
  const user = await getUser();
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("athlete_id", user.id)
    .single();
  if (error) {
    throw new Error("Error al obtener suscripción de deportista");
  }
  return data;
}
/**
 * Devuelve el ID del deportista (usuario) actual.
 */
export async function getAthleteId(): Promise<string> {
  const user = await getUser();
  if (!user?.id) {
    throw new Error("ID de deportista no encontrado");
  }
  return user.id;
}

/**
 * Actualiza el perfil del deportista.
 */
export async function updateAthleteAction(formData: unknown, id: string) {
  const validated = athleteFormSchema.safeParse(formData);
  if (!validated.success) {
    return { error: "Datos ingresados incorrectos" };
  }
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: validated.data.first_name,
      paternal_last_name: validated.data.paternal_last_name,
      maternal_last_name: validated.data.maternal_last_name,
      birth_date: validated.data.birth_date,
      dni: validated.data.dni,
      phone: validated.data.phone,
      email: validated.data.email,
      avatar_url: validated.data.avatar_url,
      last_profile_update: new Date(),
      last_avatar_change: new Date(),
    })
    .eq("id", id);

  if (error) {
    throw new Error("Error al actualizar deportista");
  }
  return data;
}

/**
 * Elimina el deportista usando el ID.
 */
export async function deleteAthleteAction(id: string) {
  const supabase = await getServiceClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) {
    throw new Error("Error al eliminar deportista");
  }
  return { status: 200, message: "Deportista eliminado correctamente" };
}

/**
 * Obtiene la lista de deportistas usando un procedimiento (RPC).
 */
export async function getAthletesAction() {
  const supabase = await getServiceClient();
  const { data, error } = await supabase.rpc("get_deportistas");
  if (error) {
    throw new Error("Error al obtener deportistas");
  }
  return data;
}

/**
 * Actualiza el estado de una solicitud de inscripción para un deportista.
 */
export async function updateStatusAthleteAction(id: string, status: string) {
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("enrollment_requests")
    .update({ status })
    .eq("athlete_id", id);
  if (error) {
    console.error("Error updating status", error);
    throw new Error("Error updating status");
  }
  return data;
}

/**
 * Actualiza el nivel del deportista.
 */
export async function updateLevelAthleteAction(id: string, level: string) {
  const supabase = await getServiceClient();
  const { data, error } = await supabase.from("athletes").update({ level }).eq("athlete_id", id);
  if (error) {
    console.error("Error updating level", error);
    throw new Error("Error updating level");
  }
  return data;
}

/**
 * Obtiene la cantidad de deportistas registrados.
 */
export async function getAthletesCount() {
  const supabase = await getServiceClient();
  const { data, error } = await supabase.from("profiles").select("id").eq("role", "deportista");
  if (error) {
    throw new Error("Error al obtener el conteo de deportistas");
  }
  return data.length;
}

/**
 * Obtiene la distribución por niveles de los deportistas.
 */
export async function getAthleteDistribution() {
  const supabase = await getServiceClient();
  const { data, error } = await supabase.from("athletes").select("level");
  if (error) {
    throw new Error("Error al obtener la distribución de deportistas");
  }
  const levels = data.map((athlete: any) => athlete.level);
  const beginner = levels.filter((level: string) => level === "beginner").length;
  const intermediate = levels.filter((level: string) => level === "intermediate").length;
  const advanced = levels.filter((level: string) => level === "advanced").length;
  return { beginner, intermediate, advanced };
}

/**
 * Genera o regresa un código de verificación para el deportista.
 */
export async function generateVerificationCode() {
  const athleteId = await getAthleteId();
  const supabase = await getServiceClient();

  // Verificar si ya existe un verification_id
  const { data: athlete, error } = await supabase
    .from("athletes")
    .select("verification_id")
    .eq("athlete_id", athleteId)
    .single();
  if (error) {
    throw new Error("Error al obtener datos del deportista");
  }
  if (athlete.verification_id) return { status: 200, data: athlete.verification_id };

  // Generar verification_id y actualizar
  const verification_id = uuidv4();
  const { error: updateError } = await supabase
    .from("athletes")
    .update({ verification_id })
    .eq("athlete_id", athleteId);
  if (updateError) {
    throw new Error("Error al generar código de verificación");
  }
  return { status: 200, data: verification_id };
}

/**
 * Obtiene la fecha de pago del deportista.
 */
export async function getPaymentDate() {
  const athleteId = await getAthleteId();
  const supabase = await getServiceClient();
  const { data: payment, error } = await supabase
    .from("payments")
    .select("payment_date")
    .eq("athlete_id", athleteId)
    .limit(1)
    .single();
  if (error || !payment) {
    console.error("Error al obtener datos de pago", error);
    throw new Error("Error al obtener datos de pago");
  }
  return { status: 200, data: payment.payment_date };
}

/**
 * Obtiene la fecha del último cambio de foto de perfil.
 */
export async function getLastAvatarDate() {
  const athleteId = await getAthleteId();
  const supabase = await getServiceClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("last_avatar_change")
    .eq("id", athleteId)
    .single();
  if (error) {
    throw new Error("Error al obtener datos de perfil");
  }
  return { status: 200, data: profile.last_avatar_change };
}

/**
 * Obtiene la fecha de la última actualización del perfil.
 */
export async function getLastProfileUpdateDate() {
  const athleteId = await getAthleteId();
  const supabase = await getServiceClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("last_profile_update")
    .eq("id", athleteId)
    .single();
  if (error) {
    throw new Error("Error al obtener datos de perfil");
  }
  return { status: 200, data: profile.last_profile_update };
}
export async function getAllPaymentData() {
  const user = await getUser();
  const payments = await getPaymentsAction();
  const profile = await getProfile(user.id);
  const enrollment = await getEnrollmentAction();
  const subscriptionData = await getSubscription();
  return { user, payments, profile, enrollment, subscriptionData };
}
