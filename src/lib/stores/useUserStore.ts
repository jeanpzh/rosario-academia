import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  id: string;
  dni: string;
  avatar_url: string | null;
  birth_date: string;
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
}

interface Payment {
  amount: number;
  payment_date: string;
  method_name: string;
}

interface Schedule {
  weekday: string;
  schedule_id: number | null;
  schedule_name: string | null;
  start_time: string | null;
  end_time: string | null;
  level: string | null;
}

interface EnrollmentRequest {
  request_id: number;
  request_date: string;
  status: "pending" | "approved" | "rejected";
  requested_schedule: Schedule;
  assigned_schedule: Schedule;
}

interface AthleteState {
  email: string;
  athlete_id: string;
  level: "beginner" | "intermediate" | "advanced";
  height: string | null;
  weight: string | null;
  profile: Profile;
  payments: Payment[] | null;
  enrollment_requests: EnrollmentRequest[];
}
export interface AthleteStore {
  athlete: AthleteState | null;
  loading: boolean;
  fetchAthleteData: () => Promise<void>;
  clearAthleteData: () => void;
  setAthleteData: (data: AthleteState) => void;
}
const supabase = createClient();

export const useAthleteStore = create<AthleteStore>()(
  persist(
    (set) => ({
      athlete: null,
      loading: false,
      setAthleteData: (updateProfile) => {
        set((state) => ({
          athlete: state.athlete
            ? {
                ...state.athlete,

                profile: {
                  ...state.athlete.profile,
                  ...updateProfile,
                },
              }
            : null,
        }));
      },
      fetchAthleteData: async () => {
        set({ loading: true });
        const { data: user, error: err } = await supabase.auth.getUser();

        if (err || !user) {
          console.error("Error fetching user data:", err);
          set({ loading: false });
          return;
        }
        const athleteId = user.user.id;
        const email = user.user.email ?? "";

        // 🚀 Cargar datos básicos del atleta
        const { data, error } = await supabase.rpc("get_athlete_data", {
          athlete_uuid: athleteId,
        });

        if (error) {
          console.error("Error fetching athlete data:", error);
          set({ loading: false });
          return;
        }

        set({
          athlete: {
            athlete_id: data.athlete_id,
            level: data.level,
            height: data.height,
            weight: data.weight,
            profile: data.profile,
            email: email,
            payments: [],
            enrollment_requests: [],
          },
          loading: false,
        });

        set({ loading: true });

        const [paymentsResult, enrollmentResult] = await Promise.all([
          supabase.rpc("get_payments", { athlete_uuid: athleteId }),
          supabase.rpc("get_enrollment_requests", { athlete_uuid: athleteId }),
        ]);

        if (paymentsResult.error || enrollmentResult.error) {
          console.log(
            "Error fetching additional data:",
            paymentsResult.error || enrollmentResult.error,
          );
          return set({ loading: false });
        }
        set((state) => ({
          athlete: {
            ...state.athlete!,
            payments: paymentsResult.data ?? [],
            enrollment_requests: enrollmentResult.data ?? [],
          } as AthleteState,
          loading: false,
        }));
      },

      clearAthleteData: () => {
        set({ athlete: null });
        localStorage.removeItem("athlete-store");
      },
    }),
    {
      name: "athlete-store",
    },
  ),
);
