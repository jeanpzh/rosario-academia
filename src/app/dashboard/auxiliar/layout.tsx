import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import links from "@/utils/links/auxiliar-links";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (profileError) return redirect("/sign-in");
  if (profile?.role !== "auxiliar_administrativo") return redirect("/dashboard");

  return (
    <div className="flex min-h-screen w-full bg-background max-md:flex max-md:flex-col">
      <DashboardSidebar user={profile} links={links} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
