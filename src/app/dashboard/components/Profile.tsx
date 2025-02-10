"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";

async function getProfile() {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user.id)
    .single();

  if (profileError) throw profileError;

  return profile;
}

export default function Profile() {
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) return <Skeleton className="h-[300px] w-full" />;
  if (error) return <div className="text-center text-red-500">Error al cargar el perfil</div>;

  if (!profile) {
    return (
      <Card className="h-auto">
        <CardContent className="flex items-center space-x-4 pt-6">
          <p className="text-sm text-muted-foreground">No se pudo cargar el perfil</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-auto">
      <CardContent className="flex h-auto flex-col items-center space-y-4 pt-6">
        <Avatar className="size-20">
          <AvatarImage
            src={profile.avatar_url || "/avatar-placeholder.png"}
            alt="Avatar del administrador"
          />
          <AvatarFallback>
            {profile.first_name?.charAt(0)}
            {profile.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {profile.first_name} {profile.last_name}
          </h3>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="text-sm font-medium text-primary">Rol: {profile.role}</p>
        </div>
        <div className="w-full space-y-2 text-sm text-muted-foreground">
          <p>
            Fecha de Nacimiento:{" "}
            {profile.birth_date
              ? new Date(profile.birth_date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "No especificada"}
          </p>
          <p>DNI: {profile.dni || "No especificado"}</p>
          <p>Teléfono: {profile.phone || "No especificado"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
