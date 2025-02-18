"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import { formatDate, getNextFormattedDate } from "@/utils/formats";
import { useHandlePrint } from "@/app/dashboard/athlete/carnet/hooks/useHandlePrint";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateVerificationCode, getPaymentDate } from "@/app/dashboard/actions/athleteActions";
import LoadingPage from "@/components/LoadingPage";
import AthleteDetails from "@/app/dashboard/athlete/carnet/components/athlete-details";
import AthleteVerification from "@/app/dashboard/athlete/carnet/components/athlete-verification";

const AthleteCard = () => {
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
                <AthleteDetails
                  athleteData={athleteData}
                  availableDate={availableDate}
                  DEFAULT_IMAGE={DEFAULT_IMAGE}
                  formatDate={formatDate}
                />
                <AthleteVerification verificationUrl={verificationUrl} />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AthleteCard;
