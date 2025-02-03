import { Payment } from "mercadopago";
import { revalidatePath } from "next/cache";

import { MP } from "../payment-processor";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: { data: { id: string } } = await request.json();

  // Obtenemos el pago
  const payment = await new Payment(MP).get({ id: body.data.id });
  // Si se aprueba, agregamos el mensaje
  if (payment.status === "approved") {
    // Obtenemos los datos
    // Update status on enrollment_requests and create a register for payment_methods and payments
    const supabase = await createClient();
    const { data, error: enrollmentError } = await supabase
      .from("enrollment_requests")
      .update({ status: "approved" })
      .match({ athlete_id: payment.metadata.user_id });

    if (enrollmentError || !data) console.log("error: ", enrollmentError);

    // Insert payment data into the database (payment_methods and payments)
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("*")
      .match({ transaction_reference: payment.id })
      .single();

    if (existingPayment) {
      // El pago ya fue insertado, no se crea duplicado
      return new Response(null, { status: 200 });
    }

    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        athlete_id: payment.metadata.user_id,
        amount: payment.transaction_amount,
        payment_date: payment.date_approved,
        payment_method_id: 3,
        transaction_reference: payment.id,
      })
      .single();

    if (!paymentData || paymentError) console.log("error: ", paymentError);

    // Revalidamos la página de inicio para mostrar los datos actualizados
    revalidatePath("/dashboard/athlete/payments");
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, { status: 200 });
}
