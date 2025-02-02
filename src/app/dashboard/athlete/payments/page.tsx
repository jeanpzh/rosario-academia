"use client";

import { Button } from "@/components/ui/button";

export default function PaymentView() {
  const handlePayment = () => {
    window.location.href = "https://express.culqi.com/pago/QJC5UJE2CK";
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Realizar Pago</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Haz clic en el botón para proceder con el pago seguro a través de Culqi.
      </p>
      <Button onClick={handlePayment} className="bg-blue-600 hover:bg-blue-700 text-white">
        Pagar
      </Button>
    </div>
  );
}
