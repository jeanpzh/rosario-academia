"use client";

import { useAthleteStore } from "@/lib/stores/useUserStore";
import WeeklySchedule from "./components/WeeklySchedule";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const [scheduleItems, setScheduleItems] = useState([]);
  const { athlete } = useAthleteStore();

  const formatData = (ath: any) => {
    return ath.enrollment_requests.map((request: any) => ({
      weekday: request.requested_schedule.weekday,
      start_time: request.requested_schedule.start_time,
      end_time: request.requested_schedule.end_time,
      schedule_name: request.requested_schedule.schedule_name,
    }));
  };
  useEffect(() => {
    if (athlete) {
      const scheduleItemsa = formatData(athlete);
      setScheduleItems(scheduleItemsa);
    }
  }, [athlete]);

  return (
    <main className="min-h-screen dark:bg-[#181818]">
      <WeeklySchedule scheduleItems={scheduleItems} />
    </main>
  );
}
