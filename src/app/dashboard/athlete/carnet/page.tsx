"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import { QRCodeSVG } from "qrcode.react";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import { BASE_URL } from "@/lib/config";

const AthleteCard = () => {
  const { athlete: athleteData } = useAthleteStore();
  const [showPreview, setShowPreview] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
    documentTitle: `Carnet_${athleteData?.profile.first_name}_${athleteData?.profile.paternal_last_name}`,
    bodyClass: "print-body",
    pageStyle: `
      @page {
        size: 100mm 80mm;
        margin: 0;
        marks: none; /* Elimina las marcas de corte de página */
      }
      @media print {
        @page {
        size: 110mm 110mm;
        margin: 0;
        marks: none; 
      }
        body {
          margin: 0; /* Elimina márgenes del body */
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .print-card {
          width: 60mm;
          height: 110mm;
          padding: 4mm;
          box-sizing: border-box;
          font-size: 5pt;
          display: flex;
          flex-direction: column;
        }
        .print-card .header {
          font-size: 6pt;
          margin-bottom: 1mm;
        }
        .print-card .avatar {
          width: 20mm;
          height: 20mm;
        }
        .print-card .content {
          display: flex;
          flex-direction: row;
        }
        .print-card .info {
          margin-left: 2mm;
        }
        .print-card p {
          margin: 0.5mm 0;
        }
      }
    `,
    onPrintError: (error) => console.log(error),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (!athleteData) return null;

  console.log(BASE_URL);

  const verificationUrl = `https://rosario-academia.vercel.app/verify/${athleteData.athlete_id}`;

  return (
    <div className="min-h-screen bg-gray-100 p-4 dark:bg-[#292929] sm:p-8">
      <h1 className="mb-6 text-center font-sans text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
        Carnet de Atleta - Academia de Voleibol
      </h1>

      <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
        <HoverBorderGradient
          onClick={() => setShowPreview(!showPreview)}
          className="w-full sm:w-auto"
        >
          {showPreview ? "Ocultar" : "Mostrar"} Previsualización
        </HoverBorderGradient>
        <HoverBorderGradient onClick={() => handlePrint()} className="w-full sm:w-auto">
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
                          src="https://res.cloudinary.com/dcxmhgysh/image/upload/v1737848404/rosario-removebg-preview_yves2v.png"
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
                    <p>
                      Válido hasta:{" "}
                      {formatDate(
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() + 1),
                        ).toISOString(),
                      )}
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
