"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import React from "react";
import { Provider as BalancerProvider } from "react-wrap-balancer";

function ToasterWrapper() {
  const { theme } = useTheme();
  return <Toaster richColors theme={theme === "dark" ? "dark" : "light"} />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <BalancerProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToasterWrapper />
          {children}
        </ThemeProvider>
      </BalancerProvider>
    </QueryClientProvider>
  );
}
