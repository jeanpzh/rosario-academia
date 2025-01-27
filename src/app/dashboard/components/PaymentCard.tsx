import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PaymentCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pagos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Próximo pago: 01/06/2023</p>
        <p className="mb-4">Monto: $50.00</p>
        <Button>Realizar Pago</Button>
      </CardContent>
    </Card>
  );
}
