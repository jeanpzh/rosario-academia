import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AthleteStore {
  athlete: AthleteState | null;
  loading: boolean;
  fetchAthleteData: () => Promise<void>;
  clearAthleteData: () => void;
  setAthleteData: (data: AthleteState) => void;
  setLastAvatarChange: (date: string) => void;
  setDaysRemaining: (days: number) => void;
  setImg: (url: string) => void;
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
      setImg: (img: string | null) => {
        set((state) => ({
          athlete: state.athlete
            ? {
                ...state.athlete,
                profile: {
                  ...state.athlete.profile,
                  avatar_url: img,
                },
              }
            : null,
        }));
      },
      setLastAvatarChange: (date: string) => {
        set((state) => ({
          athlete: state.athlete
            ? {
                ...state.athlete,
                profile: {
                  ...state.athlete.profile,
                  last_avatar_change: date,
                },
              }
            : null,
        }));
      },
      setDaysRemaining(days: number) {
        set((state) => ({
          athlete: state.athlete
            ? {
                ...state.athlete,
                profile: {
                  ...state.athlete.profile,
                  days_remaining: days,
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
