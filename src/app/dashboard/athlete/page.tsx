"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ProfileCard } from "@/app/dashboard/athlete/components/ProfileCard";
import { ScheduleCard } from "@/app/dashboard/athlete/components/ScheduleCard";
import { ProgressCard } from "@/app/dashboard/athlete/components/ProgressCard";
import { PaymentCard } from "@/app/dashboard/athlete/components/PaymentCard";
import { AnnouncementsCard } from "@/app/dashboard/athlete/components/AnnouncementsCard";
import { UpcomingEventsCard } from "@/app/dashboard/athlete/components/UpComingEvents";
import { CarnetCard } from "@/app/dashboard/athlete/components/CarnetCard";
import DashboardSkeleton from "@/app/dashboard/athlete/components/DashboardSkeleton";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    const { data: userN } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data?.user?.id)
      .single();
    setUser(userN);
    console.log(userN);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background p-4 dark:bg-[#181818] md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Portal del Estudiante</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <ProfileCard className="md:col-span-2" user={user} />
        <ScheduleCard className="md:col-span-2 lg:col-span-1" />
        <ProgressCard className="md:col-span-2 lg:col-span-1" />
        <PaymentCard />
        <CarnetCard />
        <AnnouncementsCard className="w-full md:col-span-2" />
        <UpcomingEventsCard className="w-full md:col-span-2 xl:col-span-1" />
      </div>
    </div>
  );
}
