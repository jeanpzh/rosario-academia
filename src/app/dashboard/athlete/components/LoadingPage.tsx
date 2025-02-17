import React from "react";
import { cn } from "@/lib/utils";

interface LoadingPageProps {
  className?: string;
}

export default function LoadingPage({ className = "dark:bg-[#181818]" }: LoadingPageProps) {
  return (
    <div className={cn("flex h-screen items-center justify-center", className)}>
      <div className="size-16 animate-spin rounded-full border-y-2 border-primary"></div>
    </div>
  );
}
