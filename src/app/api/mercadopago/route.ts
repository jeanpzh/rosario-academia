"use server";
import { Payment } from "mercadopago";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { MP } from "@/app/dashboard/athlete";

export async function POST(request: Request) {
  try {
    const body: { data: { id: string }; type: any } = await request.json();
    const payment = await new Payment(MP).get({ id: body.data.id });

    if (body.type !== "payment") return new Response(null, { status: 400 });

    if (payment.status === "approved") {
      const supabase = await createClient();
      const { athlete_id, schedule_id } = payment.metadata;
      const currentDate = new Date();

      // 1. Buscar suscripción activa para el atleta
      let { data: activeSubscription, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("athlete_id", athlete_id)
        .eq("status", "active")
        .single();

      if (subError && subError.code !== "PGRST116") {
        console.log("Error retrieving subscription", subError);
        return new Response(null, { status: 500 });
      }

      if (activeSubscription) {
        // Si existe, verificar si se encuentra en la ventana de renovación mensual
        const endDate = new Date(activeSubscription.end_date);
        const diffTime = endDate.getTime() - currentDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays <= 5) {
          // Renovar: Extender la suscripción sumándole 1 mes al período actual
          const newEndDate = new Date(endDate);
          newEndDate.setMonth(newEndDate.getMonth() + 1);

          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              end_date: newEndDate.toISOString().split("T")[0],
              updated_at: new Date().toISOString(),
            })
            .eq("id", activeSubscription.id);
          if (updateError) {
            console.log("Error updating subscription", updateError);
            return new Response(null, { status: 500 });
          }
          activeSubscription.end_date = newEndDate.toISOString().split("T")[0];
        }
      } else {
        // No existe suscripción activa: Crear una nueva con vigencia de 1 mes
        const start_date = new Date();
        const end_date = new Date();
        end_date.setMonth(end_date.getMonth() + 1);
        const { data: newSubscription, error: newSubError } = await supabase
          .from("subscriptions")
          .insert([
            {
              athlete_id, // Se asume que subscriptions tiene la columna athlete_id
              start_date: start_date.toISOString().split("T")[0],
              end_date: end_date.toISOString().split("T")[0],
              status: "active",
            },
          ])
          .select();
        if (newSubError) {
          console.log("Error creating subscription", newSubError);
          return new Response(null, { status: 500 });
        }
        activeSubscription = newSubscription[0];
      }

      // 2. Actualizar la inscripción (enrollment_requests) asociando el subscription_id
      const { error: enrollmentError } = await supabase
        .from("enrollment_requests")
        .update({
          status: "approved",
          subscription_id: activeSubscription.id,
        })
        .eq("athlete_id", athlete_id);
      if (enrollmentError) {
        console.log(enrollmentError);
        return new Response(null, { status: 500 });
      }

      // 3. Reducir en 1 el valor actual de "available_spots"
      const { error: available_spotError } = await supabase.rpc("decrement_available_spot", {
        p_schedule_id: schedule_id,
      });
      if (available_spotError) {
        console.log(available_spotError);
        return new Response(null, { status: 500 });
      }

      // 4. Verificar duplicidad de pago
      const { data: existingPayment, error: selectError } = await supabase
        .from("payments")
        .select("*")
        .eq("transaction_reference", payment.id);
      if (selectError) {
        console.log(selectError);
        return new Response(null, { status: 500 });
      }
      if (existingPayment && existingPayment.length > 0) {
        return new Response(null, { status: 200 });
      }

      // 5. Registrar el pago, asociando el subscription_id
      const { error: paymentError } = await supabase.from("payments").insert([
        {
          athlete_id,
          subscription_id: activeSubscription.id,
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

      // 6. Refrescar la caché de la página de pagos
      revalidatePath("/dashboard/athlete/payments");

      return new Response(null, { status: 200 });
    }
    return new Response(null, { status: 400 });
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
