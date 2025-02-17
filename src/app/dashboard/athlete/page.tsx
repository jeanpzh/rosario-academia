"use client";
import { ProfileCard } from "@/app/dashboard/athlete/components/ProfileCard";
import { ScheduleCard } from "@/app/dashboard/athlete/components/ScheduleCard";
import { ProgressCard } from "@/app/dashboard/athlete/components/ProgressCard";
import { PaymentCard } from "@/app/dashboard/athlete/components/PaymentCard";
import { AnnouncementsCard } from "@/app/dashboard/athlete/components/AnnouncementsCard";
import { UpcomingEventsCard } from "@/app/dashboard/athlete/components/UpComingEvents";
import { CarnetCard } from "@/app/dashboard/athlete/components/CarnetCard";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import DashboardSkeleton from "./components/DashboardSkeleton";
import { getNextFormattedDate } from "@/utils/formats";
import { getPaymentDate } from "@/app/dashboard/actions/athleteActions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function DashboardPage() {
  const { athlete } = useAthleteStore();
  const {
    data: responseData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["paymentDate"],
    queryFn: getPaymentDate,
  });
  const availableDate = useMemo(() => {
    if (!responseData?.data) return null;
    try {
      return getNextFormattedDate(responseData.data as string);
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [responseData]);
  if (isLoading) return <DashboardSkeleton />;
  if (error) return <p>Error al cargar la información</p>;
  if (!athlete) return null;
  return (
    <div className="min-h-screen bg-background p-4 dark:bg-[#181818] md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Portal del Deportista</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <ProfileCard className="md:col-span-2" athlete={athlete} />
        <ScheduleCard className="md:col-span-2 lg:col-span-1" />
        <ProgressCard className="md:col-span-2 lg:col-span-1" />
        <PaymentCard availableDate={availableDate} />
        <CarnetCard />
        <AnnouncementsCard className="w-full md:col-span-2" />
        <UpcomingEventsCard className="w-full md:col-span-2 xl:col-span-1" />
      </div>
    </div>
  );
}
