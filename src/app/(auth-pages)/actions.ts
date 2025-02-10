"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema } from "./schemas/sign-up-schema";

export const signUpAction = async (formData: unknown) => {
  const validatedData = signUpSchema.safeParse(formData);
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!validatedData.success) {
    return encodedRedirect("error", "/sign-up", "Datos ingresados incorrectos");
  }
  const { data: findedDNI } = await supabase
    .from("profiles")
    .select("dni")
    .eq("dni", validatedData.data.dni);

  if (findedDNI && findedDNI.length > 0) {
    return {
      status: 400,
      message: "Ya existe un usuario con el DNI ingresado",
    };
  }
  // Si el usuario que se registra tiene "level" entonces es un deportista, si no es un auxiliar administrativo

  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: validatedData.data.email,
    password: validatedData.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: validatedData.data.firstName,
        paternal_last_name: validatedData.data.paternalLastName,
        maternal_last_name: validatedData.data.maternalLastName,
        birth_date: validatedData.data.birthDate,
        dni: validatedData.data.dni,
        level: validatedData.data.level,
        role: "deportista",
        avatar_url: null,
        phone: validatedData.data.phone,
      },
    },
  });
  if (signupError) {
    console.error(signupError);
    return encodedRedirect("error", "/sign-up", signupError.message);
  }
  const { error: rpcError } = await supabase.rpc("process_new_user", {
    p_id: signupData.user?.id,
    p_raw_user_meta_data: {
      first_name: validatedData.data.firstName,
      paternal_last_name: validatedData.data.paternalLastName,
      maternal_last_name: validatedData.data.maternalLastName,
      birth_date: validatedData.data.birthDate,
      dni: validatedData.data.dni,
      level: validatedData.data.level,
      role: "deportista",
      avatar_url: null,
      phone: validatedData.data.phone,
    },
  });

  if (rpcError) {
    console.log({ rpcError });
    return encodedRedirect("error", "/sign-up", rpcError.message);
  }
  return encodedRedirect(
    "success",
    "/sign-up",
    "Gracias por registrarte. Por favor, verifica tu correo electrónico.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return encodedRedirect("error", "/sign-in", error.message);
  }
  const { data: user } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user?.id)
    .single();
  if (profile?.role === "admin") {
    return redirect("/dashboard/admin");
  } else if (profile?.role === "deportista") {
    return redirect("/loading-data");
  } else if (profile?.role === "auxiliar_administrativo") {
    return redirect("/dashboard/auxiliar");
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/forgot-password", "Could not reset password");
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    encodedRedirect("error", "/protected/reset-password", "Passwords do not match");
  }

  const supabase = await createClient();

  // Update password with valid session
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect("error", "/protected/reset-password", "Password update failed");
  }

  encodedRedirect("success", "/sign-in", "Password updated successfully");
}
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/logout-cleanup");
};

export const getProfile = async (userId: string) => {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId);
  return profile;
};
