"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { FormMessage, type Message } from "@/components/form-message";
import { motion } from "framer-motion";
import { FORM_FIELDS_STEP_ONE } from "../fields";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import { signUpAction } from "../actions";
import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpSchema } from "../schemas/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "./TextField";
import RadioFields from "./RadioFields";
import VerifyPassword from "./VerifyPassword";
import { PasswordVisualizer } from "./PasswordVisualizer";
import { FlipWords } from "@/components/flip-words";

interface SignUpFormProps {
  message: Message;
}

export default function SignUpForm({ message }: SignUpFormProps) {
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState(1);

  const words = ["aprender", "mejorar", "divertirte", "practicar"];
  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

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
      {/* Left Section */}
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-black p-8 text-white lg:flex lg:w-1/2 ">
        <div className="flex h-[40rem] items-center justify-center px-4">
          <div className="mx-auto text-4xl font-normal text-neutral-600 dark:text-neutral-400">
            <span className="text-5xl">Bienvenidos!</span>
            <br /> <br />
            Academia Rosario <br />
            Ven a <FlipWords words={words} />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full p-4 lg:w-1/2 lg:p-8">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-2 text-2xl font-semibold">Registrar</h2>
          <p className="mb-6 text-gray-600">Ingresa tus datos para registrarte</p>

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {FORM_FIELDS_STEP_ONE.filter(
                      (field) => !["password", "confirmPassword", "email"].includes(field.name),
                    ).map((field, index) => (
                      <TextField
                        key={index}
                        htmlFor={field.name}
                        control={control}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        placeholder={field.placeholder}
                      />
                    ))}
                  </div>

                  <div className="w-full">
                    <TextField
                      htmlFor="email"
                      control={control}
                      name="email"
                      label="Correo Electrónico"
                      type="email"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <TextField
                        htmlFor="password"
                        control={control}
                        name="password"
                        label="Contraseña"
                        type="password"
                        placeholder="********"
                        id="password-input"
                      />
                      <PasswordVisualizer inputId="password-input" />
                    </div>

                    <VerifyPassword password={watch("password", "")} />

                    <div className="relative">
                      <TextField
                        htmlFor="confirmPassword"
                        control={control}
                        name="confirmPassword"
                        label="Confirmar Contraseña"
                        type="password"
                        placeholder="********"
                        id="confirm-password-input"
                      />
                      <PasswordVisualizer inputId="confirm-password-input" />
                    </div>
                  </div>

                  <HoverBorderGradient
                    onClick={() => setStep(2)}
                    className="w-full"
                    containerClassName="w-full"
                  >
                    Siguiente
                  </HoverBorderGradient>

                  <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/sign-in" className="text-blue-500 hover:underline">
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <RadioFields control={control} name="level" labelText="Niveles" />
                  <div className="flex justify-between gap-4">
                    <HoverBorderGradient
                      onClick={() => setStep(1)}
                      className="w-full"
                      containerClassName="w-full"
                    >
                      Atrás
                    </HoverBorderGradient>
                    <HoverBorderGradient className="w-full" containerClassName="w-full">
                      {pending ? "Registrando..." : "Registrar"}
                    </HoverBorderGradient>
                  </div>
                </div>
              )}
            </motion.div>
          </form>
          <FormMessage message={message} />
        </div>
      </div>
    </div>
  );
}
