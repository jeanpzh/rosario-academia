"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { PaymentStatus } from "./payment-status";
import { PaymentHistory } from "./payment-history";
import { BenefitsSection } from "./benefits-section";
import { submit } from "@/app/dashboard/athlete/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllPaymentData } from "@/app/dashboard/actions/athleteActions";

import LoadingPage from "@/components/LoadingPage";
import { useQuery } from "@tanstack/react-query";

export function PaymentDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allPaymentData"],
    queryFn: getAllPaymentData,
  });
  if (isLoading) return <LoadingPage />;
  if (error) {
    return <div>Ocurrió un error inesperado</div>;
  }
  const { user, profile, enrollment, payments, subscriptionData } = data || {};

  console.log({ profile });

  const handleBuy = async () => {
    if (profile[0]?.avatar_url === null) {
      toast.error("Debes completar tu perfil antes de realizar el pago.");
      return;
    }
    try {
      const url = await submit(user.id, enrollment?.requested_schedule_id as string);
      if (url) {
        toast.success("Pago procesado correctamente. Redirigiendo a MercadoPago...");
        window.location.href = url;
      } else {
        toast.error("Hubo un error al procesar el pago. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      toast.error("Hubo un error al procesar el pago. Por favor, intenta de nuevo.");
    }
  };
  const calculateDaysUntilNextPayment = () => {
    if (!payments || payments.length === 0) return 0;
    const nextPaymentDate = new Date(subscriptionData?.end_date);
    const today = new Date();
    const diffTime = nextPaymentDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilNextPayment = calculateDaysUntilNextPayment();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#181818] dark:text-gray-100"
    >
      <header className="bg-white shadow dark:bg-[#222222]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold">Pagos y Suscripción</h1>
        </div>
      </header>
      <main className="container mx-auto space-y-8 p-4">
        <PaymentStatus
          isPaid={enrollment?.status === "approved"}
          onPayNow={handleBuy}
          payment_method={payments?.[0]?.payment_method || "Yape"}
          last_payment_date={
            payments?.[0]?.payment_date
              ? new Date(payments[0].payment_date).toLocaleDateString()
              : "N/A"
          }
          payment_amount={payments?.[0]?.amount || "N/A"}
          daysUntilNextPayment={daysUntilNextPayment}
        />
        {profile[0]?.avatar_url === null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20"
          >
            <p className="text-yellow-800 dark:text-yellow-200">
              Debes completar tu perfil para poder realizar el pago. Específicamente, subir una
              foto.
            </p>
            <Link href="/dashboard/athlete/profile">
              <Button variant="link" className="mt-2 p-0 text-yellow-600 dark:text-yellow-400">
                Completar perfil
              </Button>
            </Link>
          </motion.div>
        )}
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PaymentHistory
              payments={
                payments?.map((payment, index) => ({
                  id: index,
                  date: new Date(payment.payment_date).toLocaleDateString(),
                  amount: payment.amount,
                  method: "Yape",
                  status: "Pagado",
                })) || []
              }
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BenefitsSection />
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}
