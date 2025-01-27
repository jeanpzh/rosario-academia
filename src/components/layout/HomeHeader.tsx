import React from "react";
import HeaderAuth from "@/components/header-auth";
import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";

export default function HomeHeader() {
  return (
    <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={"/"}>Academia Rosario</Link>
          <ThemeSwitcher />
        </div>
        <HeaderAuth />
      </div>
    </nav>
  );
}
