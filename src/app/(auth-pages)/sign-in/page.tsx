import { signInAction } from "../actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className="flex min-w-64 flex-1 flex-col">
        <h1 className="text-2xl font-medium">Iniciar Sesión</h1>
        <p className="text-sm text-foreground">
          No tienes una cuenta?{" "}
          <Link className="font-medium text-foreground underline" href="/sign-up">
            Registrate
          </Link>
        </p>
        <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link className="text-xs text-foreground underline" href="/forgot-password">
              ¿Te olvidaste tu contraseña?
            </Link>
          </div>
          <Input type="password" name="password" placeholder="Your password" required />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Iniciar Sesión
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
