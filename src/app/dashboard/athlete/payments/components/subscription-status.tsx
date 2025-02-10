"use client";

import { useState } from "react";
import { getSubscriptionStatus } from "../../actions";

export default function SubscriptionStatusClient({ athlete_id }: { athlete_id: string }) {
  const [status, setStatus] = useState<{
    subscriptionActive: boolean;
    periodStart: Date;
    periodEnd: Date;
    now: Date;
  } | null>(null);
  const [simulateDate, setSimulateDate] = useState(""); // Permite inyectar una fecha simulada para testing

  // Función para consultar el estado de la suscripción.
  async function handleCheckStatus() {
    try {
      // Llamamos a la server action con el athlete_id y la fecha simulada (si se ingresó).
      const result = await getSubscriptionStatus({
        athlete_id,
        simulateDate: simulateDate || undefined,
      });
      setStatus(result);
    } catch (err) {
      console.error("Error obteniendo el estado de suscripción:", err);
    }
  }

  return (
    <div className="rounded-md bg-gray-50 p-4 shadow">
      <h2 className="text-lg font-bold">Estado de la Suscripción</h2>
      <div className="my-2">
        <label>
          Simular Fecha (ISO):{" "}
          <input
            type="datetime-local"
            onChange={(e) => setSimulateDate(e.target.value)}
            className="rounded border p-1"
          />
        </label>
        <button
          onClick={handleCheckStatus}
          className="ml-4 rounded bg-blue-500 px-3 py-1 text-white"
        >
          Consultar Estado
        </button>
      </div>
      {status && (
        <div className="mt-4">
          <p>
            <strong>Fecha actual:</strong> {new Date(status.now).toLocaleString()}
          </p>
          <p>
            <strong>Inicio del ciclo:</strong> {new Date(status.periodStart).toLocaleString()}
          </p>
          <p>
            <strong>Fin del ciclo:</strong> {new Date(status.periodEnd).toLocaleString()}
          </p>
          <p>
            <strong>Suscripción activa:</strong> {status.subscriptionActive ? "Sí" : "No"}
          </p>
        </div>
      )}
    </div>
  );
}
