import React from "react";
import HeaderAuth from "@/components/header-auth";
import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";

export default function HomeHeader() {
  return (
    <nav className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b border-b-foreground/10">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between p-3 px-5">
        <div className="flex items-center gap-8">
          <Link href={"/"} className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            Academia Rosario
          </Link>
          <div className="hidden md:flex space-x-4">
            <a href="#noticias" className="text-sm font-medium hover:text-primary transition-colors">
              Noticias
            </a>
            <a href="#eventos" className="text-sm font-medium hover:text-primary transition-colors">
              Eventos
            </a>
            <a href="#galeria" className="text-sm font-medium hover:text-primary transition-colors">
              Galería
            </a>
            <a href="#contacto" className="text-sm font-medium hover:text-primary transition-colors">
              Contacto
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <HeaderAuth />
        </div>
      </div>
    </nav>
  );
}