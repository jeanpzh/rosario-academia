"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Athlete, LevelToSpanish } from "../profile/types";

export function ProfileCard({ className, athlete }: { className?: string; athlete: Athlete }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="size-24">
          <AvatarImage src="/avatar-placeholder.png" alt="Foto de perfil" />
          <AvatarFallback>
            {athlete?.profile?.first_name[0]}
            {athlete?.profile?.paternal_last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {athlete?.profile?.first_name} {athlete?.profile?.paternal_last_name}{" "}
            {athlete?.profile?.maternal_last_name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Nivel: {athlete?.level && LevelToSpanish[athlete?.level]}
          </p>
          <Button size="sm" variant={"default"}>
            <Link href="/dashboard/athlete/profile">Ver Perfil</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
