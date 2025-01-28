import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CarnetCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Carné de Estudiante</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Tu carné digital está listo.</p>
        <Button>Ver Carné</Button>
      </CardContent>
    </Card>
  );
}
