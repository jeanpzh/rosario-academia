// app/verify/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  // Obtener el ID desde la URL
  const id = (await params).id;

  // Consultar la base de datos en Supabase
  const { data: athlete, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!athlete || error) {
    notFound();
  }
  // Consultar si su matricula está activa ("approved")
  const { data: status, error: errorStatus } = await supabase
    .from("enrollment_requests")
    .select("status")
    .eq("athlete_id", id);

  if (!status || !status.length || status[0].status !== "approved" || errorStatus) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-96 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Verificación de Matrícula
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Nombre:</strong> {athlete.first_name} {athlete.paternal_last_name}{" "}
          {athlete.maternal_last_name}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>DNI:</strong> {athlete.dni}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Nivel:</strong> {athlete.level}
        </p>
        <p
          className={`mt-4 rounded-lg p-2 text-center ${athlete.status === "activo" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          Estado: {athlete.status}
        </p>
      </div>
    </div>
  );
}
