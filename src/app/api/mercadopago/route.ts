import { Payment } from "mercadopago";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { MP } from "@/app/dashboard/athlete";

export async function POST(request: Request) {
  try {
    const body: { data: { id: string } } = await request.json();

    const payment = await new Payment(MP).get({
      id: body.data.id,
    });

    if (payment.status === "approved") {
      const supabase = await createClient();
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user) {
        return new Response(null, { status: 404 });
      }

      // Update enrollment request status
      const { error: enrollmentError } = await supabase
        .from("enrollment_requests")
        .update({
          status: "approved",
          asigned_schedule_id: user.user.user_metadata.requested_schedule_id,
        })
        .match({ athlete_id: user.user.id });
      if (enrollmentError) return new Response(null, { status: 500 });

      // Insert payment record in database
      const { error: paymentError } = await supabase.from("payments").insert([
        {
          athlete_id: user.user.id,
          payment_date: new Date(),
          amount: payment.transaction_amount,
          payment_method_id: 3,
          transaction_reference: payment.id,
        },
      ]);
      if (paymentError) return new Response(null, { status: 500 });

      // Refresh cache for payments page
      revalidatePath("/dashboard/athlete/payments");

      return new Response(null, { status: 200 });
    }
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
