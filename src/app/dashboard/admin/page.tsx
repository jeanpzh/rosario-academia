"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AthleteDistribution } from "@/app/dashboard/components/athletes/AthleteDistribution";
import Profile from "@/app/dashboard/components/Profile";
import { useQuery } from "@tanstack/react-query";
import { getAthletesCount } from "@/app/dashboard/actions/athleteActions";
import { getAssistantCount } from "@/app/dashboard/actions/assistantActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCog } from "lucide-react";
import type React from "react";

function ControlCard({
  title,
  description,
  href,
  buttonText,
  count,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  count: number;
  icon: React.ElementType;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="text-3xl font-bold">{count}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Link
          href={href}
          className="w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {buttonText}
        </Link>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: athletesCount = 0, isLoading: isLoadingAthletes } = useQuery({
    queryKey: ["athletesCount"],
    queryFn: getAthletesCount,
  });

  const { data: assistantsCount = 0, isLoading: isLoadingAssistants } = useQuery({
    queryKey: ["assistantsCount"],
    queryFn: getAssistantCount,
  });

  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribución de Atletas</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <AthleteDistribution />
            </Suspense>
          </CardContent>
        </Card>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <Profile />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          <ControlCard
            title="Control de Atletas"
            description="Accede al control completo de atletas para gestionar perfiles, niveles y estados."
            href="/dashboard/athletes"
            buttonText="Ir a Control de Atletas"
            count={isLoadingAthletes ? 0 : athletesCount}
            icon={Users}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          <ControlCard
            title="Control de Auxiliares"
            description="Gestiona los perfiles y permisos de los auxiliares administrativos."
            href="/dashboard/assistants"
            buttonText="Ir a Control de Auxiliares"
            count={isLoadingAssistants ? 0 : assistantsCount}
            icon={UserCog}
          />
        </Suspense>
      </div>
    </div>
  );
}
