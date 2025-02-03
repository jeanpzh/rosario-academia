"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconId, IconUserBolt } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import { signOutAction } from "@/app/(auth-pages)/actions";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Calendar, DollarSignIcon } from "lucide-react";
import { useAthleteStore } from "@/lib/stores/useUserStore";
export function DashboardSidebar() {
  const unvalidatedEnrollmentLinks = [
    {
      label: "Dashboard",
      href: "/dashboard/athlete",
      icon: <IconBrandTabler className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Pagos",
      href: "/dashboard/athlete/payments",
      icon: <DollarSignIcon className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard/athlete",
      icon: <IconBrandTabler className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Perfil",
      href: "/dashboard/athlete/profile",
      icon: <IconUserBolt className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Horario",
      href: "/dashboard/athlete/schedule",
      icon: <Calendar className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Pagos",
      href: "/dashboard/athlete/payments",
      icon: <DollarSignIcon className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Carnet",
      href: "/dashboard/athlete/carnet",
      icon: <IconId className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];
  const [open, setOpen] = useState(false);

  const { athlete } = useAthleteStore();

  return (
    <div
      className={cn(
        "sticky left-0 top-0 flex h-screen w-64 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-none dark:bg-[#121212] max-md:w-full max-md:h-auto max-md:z-10 ",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10 ">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <header className="flex items-center gap-4">
              <Logo />
              <ThemeSwitcher />
            </header>
            <div className="mt-8 flex flex-col gap-2">
              {athlete?.enrollment_requests?.[0]?.status === "approved"
                ? links.map((link: any, index: number) => <SidebarLink key={index} link={link} />)
                : unvalidatedEnrollmentLinks.map((link: any, index: number) => (
                    <SidebarLink key={index} link={link} />
                  ))}
              <form action={signOutAction}>
                <Button type="submit" variant={"ghost"} className="flex items-center gap-2">
                  <IconArrowLeft className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />{" "}
                  Cerrar Sesión
                </Button>
              </form>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${athlete?.profile.first_name} `,
                href: "#",
                icon: (
                  <Image
                    src={
                      athlete?.profile.avatar_url ||
                      "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
                    }
                    className="size-8 shrink-0 rounded-full object-cover"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
