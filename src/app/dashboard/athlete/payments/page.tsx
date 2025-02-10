import { PaymentStatus } from "@/app/dashboard/athlete/payments/components/payment-status";
import { PaymentHistory } from "@/app/dashboard/athlete/payments/components/payment-history";
import { BenefitsSection } from "@/app/dashboard/athlete/payments/components/benefits-section";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { submit } from "../actions";

export default async function PaymentDashboard() {
  const supabase = await createClient();
  // Get user data
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user) {
    console.log({ error });
    return;
  }
  // Get user enrollment status
  const { data: enrollmentData, error: enrollmentError } = await supabase
    .from("enrollment_requests")
    .select("status")
    .match({ athlete_id: user.user.id });
  if (enrollmentError || !enrollmentData) {
    console.log({ enrollmentError });
    return;
  }
  // Get payment data
  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .match({ athlete_id: user.user.id });
  if (paymentError || !paymentData) {
    console.log({ paymentError });
    return;
  }

  const formattedPaymentDate = new Date(paymentData[0]?.payment_date).toLocaleDateString();

  const handleBuy = async () => {
    "use server";
    const url = await submit(user.user.id as string);
    if (!url) return;
    redirect(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-[#181818] dark:text-gray-100">
      <header className="flex items-center justify-between bg-white p-4 shadow dark:bg-[#121212]">
        <h1 className="text-2xl font-bold">Pagos</h1>
      </header>
      <main className="container mx-auto space-y-6 p-4">
        <PaymentStatus
          isPaid={enrollmentData[0]?.status === "approved"}
          onPayNow={handleBuy}
          payment_method="Tarjeta de crédito"
          last_payment_date={formattedPaymentDate}
          payment_amount={paymentData[0]?.amount}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <PaymentHistory
            isPaid={false}
            payments={paymentData.map((payment, key) => ({
              id: key,
              date: new Date(payment?.payment_date).toLocaleDateString(),
              amount: payment.amount,
              method: "Tarjeta de crédito",
              status: enrollmentData[0]?.status === "approved" ? "Pagado" : "Pendiente",
            }))}
          />

          <BenefitsSection />
        </div>
      </main>
    </div>
  );
}
