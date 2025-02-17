"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import { QRCodeSVG } from "qrcode.react";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import { formatDate, getNextFormattedDate } from "@/utils/formats";
import { useHandlePrint } from "./hooks/useHandlePrint";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateVerificationCode, getPaymentDate } from "@/app/dashboard/actions/athleteActions";
import LoadingPage from "../components/LoadingPage";

const AthleteCard = () => {
  const { athlete } = useAthleteStore();
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const { athlete: athleteData } = useAthleteStore();
  const [showPreview, setShowPreview] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);
  const handlePrint = useHandlePrint(cardRef, "Carnet de Deportista");

  const togglePreview = useCallback(() => setShowPreview((prev) => !prev), []);

  const handlePrintClick = useCallback(() => handlePrint(), [handlePrint]);

  // GET payment DATE
  const {
    data: responseData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["paymentDate"],
    queryFn: getPaymentDate,
  });
  const availableDate = useMemo(() => {
    if (!responseData?.data) return null;
    try {
      return getNextFormattedDate(responseData.data as string);
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [responseData]);

  // For generate the verification ID
  const mutationGenerate = useMutation({
    mutationKey: ["generateVerificationId"],
    mutationFn: generateVerificationCode,
    onSuccess: (data) => {
      if (data.status === 200) setVerificationId(data.data);
    },
  });
  const { mutate } = mutationGenerate;

  useEffect(() => {
    if (athleteData) {
      mutate();
    }
  }, [athleteData, mutate]);

  const verificationUrl = useMemo(
    () => `https://rosario-academia.vercel.app/verify/${verificationId}`,
    [verificationId],
  );

  const DEFAULT_IMAGE =
    "https://res.cloudinary.com/dcxmhgysh/image/upload/v1737848404/rosario-removebg-preview_yves2v.png";

  if (!athleteData) return null;
  if (isLoading) return <LoadingPage />;
  if (error) return <div>Ocurrió un error inesperado</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 dark:bg-[#181818] sm:p-8">
      <h1 className="mb-6 text-center font-sans text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
        Carnet de Deportista
      </h1>

      <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
        <HoverBorderGradient onClick={togglePreview} className="w-full sm:w-auto">
          {showPreview ? "Ocultar" : "Mostrar"} Previsualización
        </HoverBorderGradient>
        <HoverBorderGradient onClick={handlePrintClick} className="w-full sm:w-auto">
          Imprimir Carnet
        </HoverBorderGradient>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Card
              ref={cardRef}
              className="print-card w-full max-w-md overflow-hidden bg-white shadow-lg dark:bg-[#2c2c2c]"
            >
              <div className="flex">
                <div className="grow">
                  <div className="header bg-blue-600 p-2 text-white dark:bg-[#332e9b]">
                    <h2 className="text-lg font-bold">Academia Rosario</h2>
                  </div>
                  <div className="content flex p-4">
                    <div className="shrink-0">
                      <Avatar className="avatar size-24 border-2 border-blue-600 dark:border-blue-400">
                        <Image
                          src={athlete?.profile.avatar_url || DEFAULT_IMAGE}
                          alt="Logo Academia de Voleibol"
                          className="rounded-full object-cover"
                          width={96}
                          height={96}
                        />
                      </Avatar>
                    </div>
                    <div className="info ml-4 grow space-y-1 text-sm text-gray-700 dark:text-gray-200">
                      <p className="text-base font-semibold">
                        {`${athleteData.profile.first_name} ${athleteData.profile.paternal_last_name} ${athleteData.profile.maternal_last_name}`}
                      </p>
                      <p>
                        <strong>ID:</strong> {athleteData.athlete_id}
                      </p>
                      <p>
                        <strong>DNI:</strong> {athleteData.profile.dni}
                      </p>
                      <p>
                        <strong>Nacimiento:</strong> {formatDate(athleteData.profile.birth_date)}
                      </p>
                      <p>
                        <strong>Nivel:</strong>{" "}
                        {athleteData.level.charAt(0).toUpperCase() + athleteData.level.slice(1)}
                      </p>
                      {athleteData.height && (
                        <p>
                          <strong>Altura:</strong> {athleteData.height} cm
                        </p>
                      )}
                      {athleteData.weight && (
                        <p>
                          <strong>Peso:</strong> {athleteData.weight} kg
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 border-t border-gray-200 p-2 text-xs dark:border-gray-700">
                    <p className="font-semibold">Horarios:</p>
                    {athleteData?.enrollment_requests.map((request: any, index: number) => (
                      <p key={index}>
                        {request.requested_schedule.weekday}:{" "}
                        {request.requested_schedule.start_time}-
                        {request.requested_schedule.end_time}
                      </p>
                    ))}
                  </div>
                  <div className="mt-2 bg-blue-100 p-2 text-center text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {/* RESPONSEDATA + 1MONTH OR 1 YEAR */}
                    <p className="font-semibold">
                      Disponible hasta : {availableDate ? availableDate : "No disponible"}
                    </p>
                  </div>
                </div>
                <div className="flex w-1/3 flex-col items-center justify-center border-l border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-[#2c2c2c]">
                  <div className="mb-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Verificación de Matrícula
                  </div>
                  <QRCodeSVG value={verificationUrl} size={80} />
                  <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                    Escanea para verificar la matrícula del alumno en el sistema
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AthleteCard;
