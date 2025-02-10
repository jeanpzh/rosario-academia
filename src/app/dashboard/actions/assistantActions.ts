"use server";
import { createClient, getServiceClient } from "@/utils/supabase/server";
import { assistantFormSchema } from "@/app/dashboard/admin/schemas/assistant-schema";
import { encodedRedirect } from "@/utils/utils";
import { Resend } from "resend";
import crypto from "crypto";

const generateRandomPassword = (bytes = 16) => {
  return crypto.randomBytes(bytes).toString("hex");
};

export const assistantSignUpAction = async (formData: unknown) => {
  const validatedData = assistantFormSchema.safeParse(formData);
  const supabase = getServiceClient();

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
  const defaultPassword = generateRandomPassword();
  const { data: user, error } = await supabase.auth.admin.createUser({
    email_confirm: true,
    email: validatedData.data.email,
    password: defaultPassword,
    phone: validatedData.data.phone,
  });
  if (error || !user) {
    console.log(error?.stack);
    return { status: 500, message: "Error creando el usuario. Intente nuevamente." };
  }

  // Todo menos el email y password
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.user.id,
    first_name: validatedData.data.first_name,
    paternal_last_name: validatedData.data.paternal_last_name,
    maternal_last_name: validatedData.data.maternal_last_name,
    birth_date: validatedData.data.birth_date,
    dni: validatedData.data.dni,
    role: "auxiliar_administrativo",
    avatar_url: null,
    phone: validatedData.data.phone,
    email: validatedData.data.email,
  });
  if (profileError) return { status: 500, message: "Error creando el perfil" };
  // Insertar empleado
  const { error: employeeError } = await supabase.from("employees").insert({
    employee_id: user.user.id,
  });
  if (employeeError) return { status: 500, message: "Error creando el empleado" };
  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);
    await resend.emails.send({
      from: "Tu Servicio <no-reply@fisib22.com>",
      to: validatedData.data.email,
      subject: "Cuenta de Auxiliar Administrativo - Credenciales de Acceso",
      html: `<p>Hola ${validatedData.data.first_name},</p>
               <p>Se ha creado tu cuenta como auxiliar administrativo.</p>
               <p>Estas son tus credenciales:</p>
               <ul>
                 <li><strong>Email:</strong> ${validatedData.data.email}</li>
                 <li><strong>Contraseña:</strong> ${defaultPassword}</li>
               </ul>
               <p>Cambia tu contraseña en el primer inicio de sesión.</p>`,
    });
    return validatedData.data;
  } catch (sendError) {
    console.error("Error enviando el email:", sendError);
    return encodedRedirect("error", "/sign-up", "Error enviando email");
  }
};

export const updateAssistantAction = async (formData: unknown, id: string) => {
  const validatedData = assistantFormSchema.safeParse(formData);
  const supabase = getServiceClient();

  if (!validatedData.success) {
    return {
      status: 400,
      message: "Datos ingresados incorrectos",
    };
  }
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: validatedData.data.first_name,
      paternal_last_name: validatedData.data.paternal_last_name,
      maternal_last_name: validatedData.data.maternal_last_name,
      birth_date: validatedData.data.birth_date,
      dni: validatedData.data.dni,
      phone: validatedData.data.phone,
    })
    .eq("id", id);
  console.log(profileError);
  if (profileError) return { status: 500, message: "Error actualizando el perfil" };
  return validatedData.data;
};
export const deleteAssistantAction = async (id: string) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase.auth.admin.deleteUser(id);
  if (!data || error) {
    console.log("Error deleting assistant", error);
    return { status: 500, message: "Error eliminando el auxiliar" };
  }
  return { status: 200, message: "Auxiliar eliminado correctamente" };
};
export const getAssistantsAction = async () => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "auxiliar_administrativo");

  if (error || !data) {
    throw new Error("Error obteniendo los auxiliares");
  }
  return data;
};
export const getAssistantCount = async () => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "auxiliar_administrativo");
  if (error || !data) {
    console.log("Error getting assistant count", error);
    return 0;
  }
  return data?.length;
};
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const client = getServiceClient();
    const supaAdmin = await createClient();
    const { data: session, error: sessionError } = await supaAdmin.auth.getUser();

    if (sessionError || !session?.user?.email) {
      // En lugar de throw, retornamos un objeto indicando el error.
      return { success: false, message: "No se encontró una sesión activa" };
    }

    const { error: signInError } = await supaAdmin.auth.signInWithPassword({
      email: session.user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, message: "Contraseña actual incorrecta" };
    }

    const { error: updateError } = await client.auth.admin.updateUserById(session.user.id, {
      password: newPassword,
    });

    if (updateError) return { success: false, message: "Error actualizando la contraseña" };

    // Reautenticar al usuario con la nueva contraseña
    const { error: reauthError } = await supaAdmin.auth.signInWithPassword({
      email: session.user.email,
      password: newPassword,
    });
    if (reauthError) return { success: false, message: "Error reautenticando" };

    return { success: true, message: "Contraseña actualizada correctamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error interno del servidor" };
  }
};
