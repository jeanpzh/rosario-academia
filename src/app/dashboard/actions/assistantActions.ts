"use server";

import { createClient, getServiceClient } from "@/utils/supabase/server";
import { assistantFormSchema } from "@/app/dashboard/admin/schemas/assistant-schema";
import { encodedRedirect } from "@/utils/utils";
import { Resend } from "resend";
import crypto from "crypto";

/**
 * Genera una contraseña aleatoria.
 */
const generateRandomPassword = (bytes = 16): string => crypto.randomBytes(bytes).toString("hex");

/**
 * Verifica y parsea el formData usando assistantFormSchema.
 */
const validateAssistantData = (formData: unknown) => {
  const parsed = assistantFormSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error("Datos ingresados incorrectos");
  }
  return parsed.data;
};

/**
 * Verifica que no exista ya un usuario con el DNI proporcionado.
 */
const checkDuplicateDNI = async (dni: string) => {
  const supabase = await getServiceClient();
  const { data } = await supabase.from("profiles").select("dni").eq("dni", dni);
  if (data && data.length > 0) {
    throw new Error("Ya existe un usuario con el DNI ingresado");
  }
};

/**
 * Crea un usuario en Supabase usando la API de administración.
 */
const createAssistantUser = async (email: string, phone: string, defaultPassword: string) => {
  const supabase = await getServiceClient();
  const { data: user, error } = await supabase.auth.admin.createUser({
    email_confirm: true,
    email,
    password: defaultPassword,
    phone,
  });
  if (error || !user) {
    throw new Error("Error creando el usuario. Intente nuevamente.");
  }
  return user;
};

/**
 * Crea el perfil del auxiliar administrativo.
 */
const createAssistantProfile = async (
  userId: string,
  data: ReturnType<typeof validateAssistantData>,
) => {
  const supabase = await getServiceClient();
  const { error } = await supabase.from("profiles").insert({
    id: userId,
    first_name: data.first_name,
    paternal_last_name: data.paternal_last_name,
    maternal_last_name: data.maternal_last_name,
    birth_date: data.birth_date,
    dni: data.dni,
    role: "auxiliar_administrativo",
    avatar_url: null,
    phone: data.phone,
    email: data.email,
  });
  if (error) {
    throw new Error("Error creando el perfil");
  }
};

/**
 * Crea el registro de empleado.
 */
const createEmployeeRecord = async (userId: string) => {
  const supabase = await getServiceClient();
  const { error } = await supabase.from("employees").insert({
    employee_id: userId,
  });
  if (error) {
    throw new Error("Error creando el empleado");
  }
};

/**
 * Envía las credenciales al correo usando Resend.
 */
const sendAssistantEmail = async (
  recipientEmail: string,
  firstName: string,
  defaultPassword: string,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY as string);
  try {
    await resend.emails.send({
      from: "Tu Servicio <no-reply@fisib22.com>",
      to: recipientEmail,
      subject: "Cuenta de Auxiliar Administrativo - Credenciales de Acceso",
      html: `<p>Hola ${firstName},</p>
             <p>Se ha creado tu cuenta como auxiliar administrativo.</p>
             <p>Estas son tus credenciales:</p>
             <ul>
               <li><strong>Email:</strong> ${recipientEmail}</li>
               <li><strong>Contraseña:</strong> ${defaultPassword}</li>
             </ul>
             <p>Cambia tu contraseña en el primer inicio de sesión.</p>`,
    });
  } catch (sendError) {
    console.error("Error enviando el email:", sendError);
    throw new Error("Error enviando email");
  }
};

/**
 * Acción para el registro de un auxiliar administrativo.
 */
export const assistantSignUpAction = async (formData: unknown) => {
  try {
    const validatedData = validateAssistantData(formData);
    await checkDuplicateDNI(validatedData.dni);
    const defaultPassword = generateRandomPassword();
    const user = await createAssistantUser(
      validatedData.email,
      validatedData.phone,
      defaultPassword,
    );
    await createAssistantProfile(user.user.id, validatedData);
    await createEmployeeRecord(user.user.id);
    await sendAssistantEmail(validatedData.email, validatedData.first_name, defaultPassword);
    return validatedData;
  } catch (error: any) {
    console.error(error);
    return encodedRedirect("error", "/sign-up", error.message || "Error en el registro");
  }
};

/**
 * Acción para actualizar datos de un auxiliar administrativo.
 */
export const updateAssistantAction = async (formData: unknown, id: string) => {
  try {
    const validatedData = validateAssistantData(formData);
    const supabase = await getServiceClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: validatedData.first_name,
        paternal_last_name: validatedData.paternal_last_name,
        maternal_last_name: validatedData.maternal_last_name,
        birth_date: validatedData.birth_date,
        dni: validatedData.dni,
        phone: validatedData.phone,
      })
      .eq("id", id);
    if (error) {
      throw new Error("Error actualizando el perfil");
    }
    return validatedData;
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
};

/**
 * Acción para eliminar un auxiliar administrativo.
 */
export const deleteAssistantAction = async (id: string) => {
  try {
    const supabase = await getServiceClient();
    const { data, error } = await supabase.auth.admin.deleteUser(id);
    if (!data || error) {
      throw new Error("Error eliminando el auxiliar");
    }
    return { status: 200, message: "Auxiliar eliminado correctamente" };
  } catch (error: any) {
    console.error("Error deleting assistant", error);
    return { status: 500, message: error.message };
  }
};

/**
 * Acción para obtener la lista de auxiliares administrativos.
 */
export const getAssistantsAction = async () => {
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "auxiliar_administrativo");
  if (error || !data) {
    throw new Error("Error obteniendo los auxiliares");
  }
  return data;
};

/**
 * Acción para obtener la cantidad de auxiliares administrativos.
 */
export const getAssistantCount = async () => {
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "auxiliar_administrativo");
  if (error || !data) {
    console.error("Error getting assistant count", error);
    return 0;
  }
  return data.length;
};

/**
 * Acción para cambiar la contraseña de un auxiliar administrativo.
 */
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const client = await getServiceClient();
    const supaAdmin = await createClient();
    const { data: session, error: sessionError } = await supaAdmin.auth.getUser();

    if (sessionError || !session?.user?.email) {
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

    if (updateError) {
      return { success: false, message: "Error actualizando la contraseña" };
    }

    const { error: reauthError } = await supaAdmin.auth.signInWithPassword({
      email: session.user.email,
      password: newPassword,
    });
    if (reauthError) {
      return { success: false, message: "Error reautenticando" };
    }

    return { success: true, message: "Contraseña actualizada correctamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error interno del servidor" };
  }
};
