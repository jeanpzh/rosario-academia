"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import LoadingPage from "../dashboard/athlete/components/LoadingPage";

export default function LoadingDataPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await useAthleteStore.getState().fetchAthleteData();
      router.replace("/dashboard");
    })();
  }, [router]);

  return <LoadingPage />;
}
