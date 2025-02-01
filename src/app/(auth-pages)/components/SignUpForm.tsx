"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FormMessage, Message } from "@/components/form-message";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { FORM_FIELDS_STEP_ONE } from "../fields";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { signUpAction } from "../actions";
import { useForm } from "react-hook-form";
import { signUpSchema, SignUpSchema } from "../schemas/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "./TextField";
import RadioFields from "./RadioFields";

interface SignUpFormProps {
  message: Message;
}

export default function SignUpForm({ message }: SignUpFormProps) {
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState(1);
  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setPending(true);
      const res = await signUpAction(data);
      // devuelvo un error si el DNI ya se encuentra registrado
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

  /**
   * Función onError que recibe los errores generados por react-hook-form.
   * Se encarga de:
   * 1. Detectar cuál es el primer campo con error.
   * 2. Determinar a qué paso pertenece dicho campo.
   * 3. Si el paso actual no coincide, cambiar el paso y luego hacer focus sobre el campo.
   */
  const onError = (formErrors: typeof errors) => {
    // Obtiene la primera clave con error
    const firstErrorField = Object.keys(formErrors)[0] as keyof SignUpSchema;
    if (!firstErrorField) return;

    // Determinar en qué paso se encuentra el campo con error.
    // El error siempre provendrá del primer paso o del segundo.
    const stepOneFieldNames = FORM_FIELDS_STEP_ONE.map((field) => field.name);
    const errorStep = stepOneFieldNames.includes(firstErrorField) ? 1 : 2;

    // Si el error pertenece a un paso distinto, actualizamos el estado y luego hacemos focus.
    if (step !== errorStep) {
      setStep(errorStep);
      // Se utiliza un pequeño delay para esperar a que se renderice el nuevo step.
      setTimeout(() => {
        setFocus(firstErrorField);
      }, 300);
    } else {
      setFocus(firstErrorField);
    }

    // (Casos especiales) Si el error del server es "DNI ya registrado", se debe cambiar el paso (encondedRedirect).
    // http://localhost:3000/sign-up?error=El%20DNI%20ya%20se%20encuentra%20registrado
  };

  return (
    <div className="w-full p-0">
      <Card className="max-w-md">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold">Registrar</h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            ¿Ya tienes una cuenta deportista?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Loggeate
            </Link>
          </p>
        </CardHeader>
        <CardContent>
          <Progress value={step === 1 ? 50 : 100} className="mb-4" />
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 ? (
                <div>
                  {FORM_FIELDS_STEP_ONE.map((field, index) => (
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
                  <Button type="button" variant="default" onClick={() => setStep(2)}>
                    Siguiente
                  </Button>
                </div>
              ) : (
                <>
                  <RadioFields control={control} name="level" labelText="Niveles" />
                  <div className="mt-4 flex justify-between">
                    <Button type="button" onClick={() => setStep(1)} variant="outline">
                      Atrás
                    </Button>
                    <SubmitButton pending={pending} pendingText="Registrando...">
                      Registrar
                    </SubmitButton>
                  </div>
                </>
              )}
            </motion.div>
          </form>
        </CardContent>
      </Card>
      <FormMessage message={message} />
    </div>
  );
}
