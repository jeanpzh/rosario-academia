"use server";
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
      const id = payment.metadata.athlete_id;
      // Actualizar el estado de inscripción
      const { error: enrollmentError } = await supabase
        .from("enrollment_requests")
        .update({ status: "approved" })
        .eq("athlete_id", id);

      if (enrollmentError) {
        console.log(enrollmentError);
        return new Response(null, { status: 500 });
      }

      // Verificar si ya existe un registro para evitar duplicados
      const { data: existingPayment, error: selectError } = await supabase
        .from("payments")
        .select("*")
        .eq("transaction_reference", payment.id);

      if (selectError) {
        console.log(selectError);
        return new Response(null, { status: 500 });
      }

      if (existingPayment && existingPayment.length > 0) {
        // Ya existe, se evita el duplicado y se retorna éxito
        return new Response(null, { status: 200 });
      }

      // Insertar el registro del pago en la base de datos
      const { error: paymentError } = await supabase.from("payments").insert([
        {
          athlete_id: id,
          payment_date: new Date(),
          amount: payment.transaction_amount,
          payment_method_id: 3,
          transaction_reference: payment.id,
        },
      ]);
      if (paymentError) {
        console.log(paymentError);
        return new Response(null, { status: 500 });
      }

      // Refrescar la caché de la página de pagos
      revalidatePath("/dashboard/athlete/payments");

      return new Response(null, { status: 200 });
    }
    return new Response(null, { status: 400 });
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
