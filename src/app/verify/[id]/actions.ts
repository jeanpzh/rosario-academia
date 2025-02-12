"use server";
import { createClient } from "@/utils/supabase/server";

interface TResponse {
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  dni: string;
  level: "beginner" | "intermediate" | "advanced";
  enrollmentStatus: "approved" | "rejected" | "pending";
}

export const verifyAthlete = async (
  id: string,
): Promise<TResponse | { status: number; error: string }> => {
  const supabase = await createClient();
  // Get Profile info
  const { data: profileInfo, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profileInfo || profileError) {
    return { status: 404, error: "Profile not found" };
  }
  // Get level info in athlete table
  const { data: levelInfo, error: levelError } = await supabase
    .from("athletes")
    .select("level")
    .eq("athlete_id", id)
    .single();

  if (!levelInfo || levelError) {
    return { status: 404, error: "Level not found" };
  }
  // Get status info in enrollment_requests table
  const { data: statusInfo, error: statusError } = await supabase
    .from("enrollment_requests")
    .select("status")
    .eq("athlete_id", id);

  if (!statusInfo || !statusInfo.length || statusError) {
    return { status: 404, error: "Status not found" };
  }
  const first_name = profileInfo.first_name;
  const paternal_last_name = profileInfo.paternal_last_name;
  const maternal_last_name = profileInfo.maternal_last_name;
  const dni = profileInfo.dni;
  const level = levelInfo.level as "beginner" | "intermediate" | "advanced";
  const enrollmentStatus = statusInfo[0].status as "approved" | "rejected" | "pending";

  // Return a json
  return {
    first_name,
    paternal_last_name,
    maternal_last_name,
    dni,
    level,
    enrollmentStatus,
  } as TResponse;
};
