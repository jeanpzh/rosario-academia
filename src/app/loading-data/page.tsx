"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import LoadingPage from "@/components/LoadingPage";

export default function LoadingDataPage() {
  const router = useRouter();
  const fetchAthleteData = useAthleteStore((state) => state.fetchAthleteData);

  useEffect(() => {
    (async () => {
      await fetchAthleteData();
    })();
    router.replace("/dashboard");
  }, [fetchAthleteData, router]);

  return <LoadingPage />;
}
