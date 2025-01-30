import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/sign-in");

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <main className="h-full flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
