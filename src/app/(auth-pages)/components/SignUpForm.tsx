"use client";

import React from "react";
import { useState } from "react";
import { FormMessage, type Message } from "@/components/form-message";
import { motion } from "framer-motion";
import { FORM_FIELDS_STEP_ONE } from "../fields";
import { signUpAction } from "../actions";
import { FormProvider, useForm } from "react-hook-form";
import { signUpSchema, type SignUpSchema } from "../schemas/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlipWords } from "@/components/flip-words";
import SignUpStepOne from "./SignUpStepOne";
import SignUpStepTwo from "./SignUpStepTwo";

interface SignUpFormProps {
  message: Message;
}

export default function SignUpForm({ message }: SignUpFormProps) {
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState(1);

  const words = ["aprender", "mejorar", "divertirte", "practicar"];
  const methods = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const {
    handleSubmit,
    setError,
    clearErrors,
    setFocus,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setPending(true);
      const res = await signUpAction(data);
      if (res.status === 400) {
        setError("dni", {
          type: "manual",
          message: res.message,
        });
        setStep(1);
        setFocus("dni");
      } else {
        clearErrors("dni");
      }
    } catch (err: any) {
      console.log({ err });
    } finally {
      setPending(false);
    }
  };

  const onError = (formErrors: typeof errors) => {
    const firstErrorField = Object.keys(formErrors)[0] as keyof SignUpSchema;
    if (!firstErrorField) return;

    const stepOneFieldNames = FORM_FIELDS_STEP_ONE.map((field) => field.name);
    const errorStep = stepOneFieldNames.includes(firstErrorField) ? 1 : 2;

    if (step !== errorStep) {
      setStep(errorStep);
      setTimeout(() => {
        setFocus(firstErrorField);
      }, 300);
    } else {
      setFocus(firstErrorField);
    }
  };

  return (
    <div className="flex h-auto w-[80rem] rounded-lg shadow-xl">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-[rgb(246,246,246)] p-8 text-white dark:bg-black lg:flex lg:w-1/2 ">
        <div className="flex h-[40rem] items-center justify-center px-4">
          <div className="mx-auto text-4xl font-normal text-neutral-600 dark:text-neutral-400">
            <span className="text-5xl">Bienvenidos!</span>
            <br /> <br />
            Academia Rosario <br />
            Ven a <FlipWords words={words} />
          </div>
        </div>
      </div>
      <div className="w-full p-4 lg:w-1/2 lg:p-8">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-2 text-2xl font-semibold">Registrar</h2>
          <p className="mb-6 text-gray-600">Ingresa tus datos para registrarte</p>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 ? (
                  <SignUpStepOne onNext={() => setStep(2)} />
                ) : (
                  <SignUpStepTwo onPrevStep={() => setStep(1)} pending={pending} />
                )}
              </motion.div>
            </form>
            <FormMessage message={message} />
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
