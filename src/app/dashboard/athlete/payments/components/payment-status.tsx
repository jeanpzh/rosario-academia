import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface PaymentStatusProps {
  isPaid: boolean;
  onPayNow: () => void;
  payment_method: string;
  last_payment_date: string;
  payment_amount: string;
  daysUntilNextPayment: number;
}

export function PaymentStatus({
  isPaid,
  onPayNow,
  payment_method,
  last_payment_date,
  payment_amount,
  daysUntilNextPayment,
}: PaymentStatusProps) {
  const getStatus = () => {
    if (!isPaid) {
      return {
        icon: <AlertCircle className="size-6" />,
        message: "Tu matrícula está pendiente de pago",
        colorClasses: "text-yellow-600 dark:text-yellow-400",
      };
    }
    // Si se pagó, diferenciamos según los días restantes
    if (daysUntilNextPayment <= -5) {
      // Más de 5 días de retraso
      return {
        icon: <AlertCircle className="size-6" />,
        message:
          "Tu matrícula está vencida, no podrás acceder a las clases. No se pagó en la fecha límite.",
        colorClasses: "text-red-600 dark:text-red-400",
      };
    }
    if (daysUntilNextPayment <= 30 && daysUntilNextPayment > 15) {
      return {
        icon: <CheckCircle className="size-6" />,
        message: `Tu matrícula está al día, pero tu próximo pago viene en ${daysUntilNextPayment - 15} día${daysUntilNextPayment - 15 === 1 ? "" : "s"}`,
        colorClasses: "text-yellow-600 dark:text-yellow-400",
      };
    }
    if (daysUntilNextPayment <= 15 && daysUntilNextPayment > -5) {
      return {
        icon: <Clock className="size-6" />,
        message: `Pendiente de pago, vence en ${daysUntilNextPayment + 5} día${
          daysUntilNextPayment + 5 === 1 ? "" : "s"
        }`,
        colorClasses: "text-yellow-600 dark:text-yellow-400",
      };
    }
    return {
      icon: <CheckCircle className="size-6" />,
      message: "Tu matrícula está al día",
      colorClasses: "text-green-600 dark:text-green-400",
    };
  };

  const { icon, message, colorClasses } = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-gray-100 dark:bg-[#222222]">
          <CardTitle className="text-xl">
            {/* Estado de matrícula , estado de mensualidad */}
            {isPaid ? "Estado de mensualidad" : "Estado de matrícula"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className={`flex items-center space-x-2 ${colorClasses}`}
          >
            {icon}
            <p className="text-lg font-medium">{message}</p>
          </motion.div>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4 dark:bg-[#1e1e1e]">
          {isPaid ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Último pago: {last_payment_date} | Método: {payment_method} | Monto: S/.{" "}
              {payment_amount}
            </p>
          ) : (
            <Button onClick={onPayNow} className="w-full">
              Pagar ahora
            </Button>
          )}
          {isPaid && daysUntilNextPayment <= 15 && daysUntilNextPayment >= 0 && (
            <Button onClick={onPayNow} className="ml-4">
              Pagar próxima mensualidad
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
