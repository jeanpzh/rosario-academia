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
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const onSubmit = async (data: SignUpSchema) => {
    try {
      console.log({ data });
      setPending(true);
      await signUpAction(data);
    } catch (err: any) {
      console.log({ err });
    } finally {
      setPending(false);
    }
  };
  console.log({ errors });

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
          <form onSubmit={handleSubmit(onSubmit)}>
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
                      htmlFor={field.name}
                      key={index}
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
