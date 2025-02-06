"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { editProfileAction } from "@/app/dashboard/athlete/actions";
interface UserProfile {
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  phone: string;
  level?: string;
  shift?: string;
  avatar_url?: string;
  birth_date?: string;
  dni?: string;
  weight?: number;
  height?: number;
}

export function useProfileData() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [athlete, setAthlete] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        if (!userId) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        setUser(userData?.user);

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        setUserProfile(profile);

        const { data: athleteData, error: err } = await supabase
          .from("athletes")
          .select("*")
          .eq("athlete_id", profile?.id)
          .single();

        if (err) console.log("Error fetching athlete:", err);
        setAthlete(athleteData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await editProfileAction({
        firstName: data.first_name,
        paternalLastName: data.paternal_last_name,
        maternalLastName: data.maternal_last_name,
        phone: data.phone,
      });
      if (res.status !== 200) {
        throw new Error(res.message || "Error updating profile");
      }

      setUserProfile((prev) => ({
        ...prev!,
        ...data,
      }));

      return res;
    } catch (err: any) {
      console.log("Error actualizando perfil:", err);
      throw err;
    }
  };

  return {
    user,
    userProfile,
    athlete,
    loading,
    error,
    updateProfile,
  };
}
