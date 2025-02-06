import React from "react";
import Link from "next/link";
import { FORM_FIELDS_STEP_ONE } from "../fields";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import TextField from "./TextField";
import VerifyPassword from "./VerifyPassword";
import { PasswordVisualizer } from "./PasswordVisualizer";
import { useFormContext } from "react-hook-form";
import { SignUpSchema } from "../schemas/sign-up-schema";

export default function SignUpStepOne({ onNext }: { onNext: () => void }) {
  const { control, watch } = useFormContext<SignUpSchema>();
  return (
    <div className="space-y-6">
      <p className=" text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Inicia sesión
        </Link>
      </p>
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

      <HoverBorderGradient onClick={onNext} className="w-full" containerClassName="w-full">
        Siguiente
      </HoverBorderGradient>
    </div>
  );
}
