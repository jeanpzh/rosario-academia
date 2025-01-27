"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import { signOutAction } from "@/app/(auth-pages)/actions";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
    </Link>
  );
};
export function DashboardSidebar({ user }: { user?: any }) {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];
  const [open, setOpen] = useState(false);
  if (!user) return null;
  return (
    <div
      className={cn(
        "sticky left-0 top-0 flex h-screen w-64 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-none dark:bg-[#121212]",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <header className="flex items-center gap-4">
              <Logo />
              <ThemeSwitcher />
            </header>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, index) => (
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
                label: `${user?.first_name} ${user?.paternal_last_name} ${user?.maternal_last_name}`,
                href: "#",
                icon: (
                  <Image
                    src={
                      user?.image ||
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
