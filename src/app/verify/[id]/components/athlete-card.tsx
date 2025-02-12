import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  dni: string;
  level: "beginner" | "intermediate" | "advanced";
  enrollmentStatus: "approved" | "rejected" | "pending";
}

export default function AthleteCard({ athlete }: { athlete: Props }) {
  const isApproved = athlete.enrollmentStatus === "approved";

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 sm:p-6">
      <h1 className="mb-4 text-center text-xl font-bold text-gray-900 dark:text-white sm:text-left sm:text-2xl">
        Verificación de Matrícula
      </h1>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
            <strong className="block sm:inline">Nombre:</strong>
          </p>
          <p className="text-sm text-gray-900 dark:text-gray-100 sm:text-base">
            {athlete.first_name} {athlete.paternal_last_name} {athlete.maternal_last_name}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
            <strong className="block sm:inline">DNI:</strong>
          </p>
          <p className="text-sm text-gray-900 dark:text-gray-100 sm:text-base">{athlete.dni}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
            <strong className="block sm:inline">Nivel:</strong>
          </p>
          <p className="text-sm text-gray-900 dark:text-gray-100 sm:text-base">{athlete.level}</p>
        </div>
        <div
          className={`mt-4 flex flex-col items-center justify-between rounded-lg p-3 sm:flex-row ${
            isApproved ? "bg-green-100 dark:bg-green-800" : "bg-red-100 dark:bg-red-800"
          }`}
        >
          <span className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200 sm:mb-0 sm:text-base">
            Estado de Matrícula
          </span>
          <div className="flex items-center">
            {isApproved ? (
              <>
                <CheckCircle className="mr-2 size-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300 sm:text-base">
                  Aprobada
                </span>
              </>
            ) : (
              <>
                <XCircle className="mr-2 size-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300 sm:text-base">
                  Pendiente
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
