import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileCard({ className, user }: { className?: string; user?: any }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="size-24">
          <AvatarImage src="/avatar-placeholder.png" alt="Foto de perfil" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {user?.first_name} {user?.paternal_last_name} {user?.maternal_last_name}- Deportista
          </h3>
          <p className="text-sm text-muted-foreground">Nivel: {user?.level}</p>
          <Button size="sm">Actualizar Perfil</Button>
        </div>
      </CardContent>
    </Card>
  );
}
