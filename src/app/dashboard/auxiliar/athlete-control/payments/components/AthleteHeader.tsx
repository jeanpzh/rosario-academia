"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { HoverPaymentModal } from "./PaymentButton";
import { Athlete } from "@/lib/types/AthleteTable";
import { DEFAULT_IMAGE } from "@/utils/utils";

interface AthleteHeaderProps {
  athlete: Athlete;
}

export function AthleteHeader({ athlete }: AthleteHeaderProps) {
  const router = useRouter();
  const fullName = `${athlete.first_name} ${athlete.paternal_last_name} ${athlete.maternal_last_name}`;

  const handlePaymentSuccess = () => {
    router.refresh();
  };

  return (
    <Card className="flex items-center justify-between">
      <CardContent className="flex items-center space-x-4 p-6">
        <Avatar className="size-16">
          <AvatarImage src={athlete.avatar_url || DEFAULT_IMAGE} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {athlete.first_name[0]}
            {athlete.paternal_last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{fullName}</h2>
          <p className="text-muted-foreground">Historial de Pagos</p>
        </div>
      </CardContent>
      <div className="p-4">
        <HoverPaymentModal athleteId={athlete.id} onSuccess={handlePaymentSuccess} />
      </div>
    </Card>
  );
}
