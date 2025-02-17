import { PaymentStatus } from "@/app/dashboard/athlete/payments/components/payment-status";
import { PaymentHistory } from "@/app/dashboard/athlete/payments/components/payment-history";
import { BenefitsSection } from "@/app/dashboard/athlete/payments/components/benefits-section";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { submit } from "../actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PaymentDashboard() {
  const supabase = await createClient();
  // Get user data
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user) {
    console.log({ error });
    return;
  }
  // Get Profile
  const { data: profile, error: errorProfile } = await supabase
    .from("profiles")
    .select("*")
    .match({ id: user.user.id });

  if (errorProfile || !profile) {
    console.log({ errorProfile });
    return;
  }

  // Get user enrollment status and requested_schedule_id
  const { data: enrollmentData, error: enrollmentError } = await supabase
    .from("enrollment_requests")
    .select("*")
    .match({ athlete_id: user.user.id });
  if (enrollmentError || !enrollmentData) {
    console.log({ enrollmentError });
    return;
  }
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
    const url = await submit(
      user.user.id as string,
      enrollmentData[0].requested_schedule_id as string,
    );
    if (!url) return;
    redirect(url);
  };
  const AVATAR_URL = profile[0]?.avatar_url;
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-[#181818] dark:text-gray-100">
      <header className="flex items-center justify-between bg-white p-4 shadow dark:bg-[#121212]">
        <h1 className="text-2xl font-bold">Pagos</h1>
      </header>
      <main className="container mx-auto space-y-6 p-4">
        <PaymentStatus
          disabled={!AVATAR_URL}
          isPaid={enrollmentData[0]?.status === "approved"}
          onPayNow={handleBuy}
          payment_method="Yape"
          last_payment_date={formattedPaymentDate}
          payment_amount={paymentData[0]?.amount}
        />
        {!AVATAR_URL && (
          <div className="flex items-center gap-2">
            <p className="text-red-600 dark:text-red-400">
              Debes completar tu perfil para poder realizar el pago. Específicamente, subir una
              foto.
            </p>
            <Link href="/dashboard/athlete/profile" className="text-blue-600 dark:text-blue-400">
              <Button variant={"link"}>Completar perfil</Button>
            </Link>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          <PaymentHistory
            isPaid={false}
            payments={paymentData.map((payment, key) => ({
              id: key,
              date: new Date(payment?.payment_date).toLocaleDateString(),
              amount: payment.amount,
              method: "Yape",
              status: enrollmentData[0]?.status === "approved" ? "Pagado" : "Pendiente",
            }))}
          />

          <BenefitsSection />
        </div>
      </main>
    </div>
  );
}
