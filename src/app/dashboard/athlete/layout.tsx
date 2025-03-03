import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { linksApproved, linksPending } from "@/utils/links/athlete-links";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/sign-in");

  const { data, error } = await supabase
    .from("enrollment_requests")
    .select("status")
    .match({ athlete_id: user.id });

  if (error || !data) {
    console.log({ error });
    return;
  }

  const linksByStatus = data[0].status === "approved" ? linksApproved : linksPending;

  return (
    <div className="flex min-h-screen w-full max-md:flex max-md:flex-col">
      <DashboardSidebar links={linksByStatus} user={user.user_metadata} />
      <main className="mx-auto max-w-7xl flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
