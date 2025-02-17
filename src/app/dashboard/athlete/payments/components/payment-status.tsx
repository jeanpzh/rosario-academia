import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface PaymentStatusProps {
  isPaid: boolean;
  onPayNow: () => void;
  payment_method: string;
  last_payment_date: string;
  payment_amount: string;
  disabled?: boolean;
}

export function PaymentStatus({
  isPaid,
  onPayNow,
  payment_method,
  last_payment_date,
  payment_amount,
  disabled,
}: PaymentStatusProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Estado de tu Matrícula</CardTitle>
      </CardHeader>
      <CardContent>
        {isPaid ? (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="size-6" />
            <p className="text-lg font-semibold">¡Tu matrícula está al día!</p>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="size-6" />
            <p className="text-lg font-semibold">Tu matrícula está pendiente de pago</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isPaid ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Último pago: {last_payment_date}| Método: {payment_method} | Monto: S/.{payment_amount}
          </p>
        ) : (
          <Button disabled={disabled} onClick={onPayNow}>
            Pagar ahora
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
