"use server";

import { createClient, getServiceClient } from "@/utils/supabase/server";
import { assistantFormSchema } from "@/app/dashboard/admin/schemas/assistant-schema";
import { encodedRedirect } from "@/utils/utils";
import { Resend } from "resend";
import crypto from "crypto";

/**
 * Generate a random password.
 *
 * @param bytes - Number of random bytes to generate (default 16)
 * @returns A hex string representing the random password.
 */
const generateRandomPassword = (bytes = 16): string => crypto.randomBytes(bytes).toString("hex");

/**
 * Validate and parse formData using assistantFormSchema.
 *
 * @param formData - The form data to validate.
 * @returns The validated and parsed data.
 * @throws An error if the data is invalid.
 */
const validateAssistantData = (formData: unknown) => {
  const parsed = assistantFormSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error("Datos ingresados incorrectos");
  }
  return parsed.data;
};

/**
 * Helper function: withSupabase
 *
 * This function encapsulates the process of obtaining a Supabase client
 * and executing a provided callback with that client. This helps reduce
 * repetitive code when performing operations that require a Supabase client.
 *
 * @param callback - An async callback function that receives the Supabase client.
 * @returns The result of the callback.
 */
async function withSupabase<T>(
  callback: (supabase: Awaited<ReturnType<typeof getServiceClient>>) => Promise<T>,
): Promise<T> {
  // Retrieve the Supabase client (make sure to await if getServiceClient() returns a promise)
  const supabase = await getServiceClient();
  // Execute the callback with the client and return its result
  return callback(supabase);
}

/**
 * Check if a profile with the given DNI already exists.
 *
 * @param dni - The DNI to check for duplicates.
 * @throws An error if a duplicate DNI is found.
 */
const checkDuplicateDNI = async (dni: string) =>
  withSupabase(async (supabase) => {
    const { data } = await supabase.from("profiles").select("dni").eq("dni", dni);
    if (data && data.length > 0) {
      throw new Error("Ya existe un usuario con el DNI ingresado");
    }
  });

/**
 * Create an assistant user using the Supabase Admin API.
 *
 * @param email - The user's email.
 * @param phone - The user's phone.
 * @param defaultPassword - The password to assign to the new user.
 * @returns The created user object.
 * @throws An error if user creation fails.
 */
const createAssistantUser = async (email: string, phone: string, defaultPassword: string) =>
  withSupabase(async (supabase) => {
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
  });

/**
 * Create the profile for the assistant.
 *
 * @param userId - The ID of the created user.
 * @param data - The validated data for the assistant.
 * @throws An error if profile creation fails.
 */
const createAssistantProfile = async (
  userId: string,
  data: ReturnType<typeof validateAssistantData>,
) =>
  withSupabase(async (supabase) => {
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
  });

/**
 * Create the employee record for the assistant.
 *
 * @param userId - The ID of the created user.
 * @throws An error if creating the employee record fails.
 */
const createEmployeeRecord = async (userId: string) =>
  withSupabase(async (supabase) => {
    const { error } = await supabase.from("employees").insert({
      employee_id: userId,
    });
    if (error) {
      throw new Error("Error creando el empleado");
    }
  });

/**
 * Send an email with the assistant's credentials using Resend.
 *
 * @param recipientEmail - The email address to send to.
 * @param firstName - The first name of the assistant.
 * @param defaultPassword - The default password generated.
 * @throws An error if sending the email fails.
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
 * Action for assistant sign-up.
 *
 * This function handles the entire sign-up process:
 * - Validate the incoming form data.
 * - Check for duplicate DNI.
 * - Create the assistant user.
 * - Create the assistant profile and employee record concurrently.
 * - Send an email with credentials.
 *
 * @param formData - The form data for sign-up.
 * @returns The validated data if successful, or an encoded redirect with error details.
 */
export const assistantSignUpAction = async (formData: unknown) => {
  try {
    const validatedData = validateAssistantData(formData);
    // Check if DNI already exists
    await checkDuplicateDNI(validatedData.dni);

    // Generate a default random password for the user
    const defaultPassword = generateRandomPassword();

    // Create the user via Supabase Admin API
    const userResponse = await createAssistantUser(
      validatedData.email,
      validatedData.phone,
      defaultPassword,
    );
    const userId = userResponse.user.id;

    // Create profile and employee record concurrently using Promise.all
    await Promise.all([
      createAssistantProfile(userId, validatedData),
      createEmployeeRecord(userId),
    ]);

    // Send an email with the credentials to the assistant
    await sendAssistantEmail(validatedData.email, validatedData.first_name, defaultPassword);

    return validatedData;
  } catch (error: any) {
    console.error(error);
    return encodedRedirect("error", "/sign-up", error.message || "Error en el registro");
  }
};

/**
 * Action for updating an assistant's data.
 *
 * @param formData - The new data to update.
 * @param id - The assistant's user ID.
 * @returns The validated data if successful, or an error object.
 */
export const updateAssistantAction = async (formData: unknown, id: string) => {
  try {
    const validatedData = validateAssistantData(formData);
    await withSupabase(async (supabase) => {
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
    });
    return validatedData;
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
};

/**
 * Action for deleting an assistant.
 *
 * @param id - The assistant's user ID.
 * @returns An object indicating success or failure.
 */
export const deleteAssistantAction = async (id: string) => {
  try {
    return await withSupabase(async (supabase) => {
      const { data, error } = await supabase.auth.admin.deleteUser(id);
      if (error || !data) {
        throw new Error("Error eliminando el auxiliar");
      }
      return { status: 200, message: "Auxiliar eliminado correctamente" };
    });
  } catch (error: any) {
    console.error("Error deleting assistant", error);
    return { status: 500, message: error.message };
  }
};

/**
 * Action for retrieving the list of assistants.
 *
 * @returns The list of assistant profiles.
 */
export const getAssistantsAction = async () =>
  withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "auxiliar_administrativo");
    if (error || !data) {
      throw new Error("Error obteniendo los auxiliares");
    }
    return data;
  });

/**
 * Action for retrieving the count of assistants.
 *
 * @returns The number of assistant profiles.
 */
export const getAssistantCount = async () => {
  try {
    return await withSupabase(async (supabase) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "auxiliar_administrativo");
      if (error || !data) {
        console.error("Error getting assistant count", error);
        return 0;
      }
      return data.length;
    });
  } catch (error) {
    console.error("Error in getAssistantCount", error);
    return 0;
  }
};

/**
 * Action for changing an assistant's password.
 *
 * This function verifies the current password, updates to the new password,
 * and then reauthenticates the user with the new password.
 *
 * @param currentPassword - The current password.
 * @param newPassword - The new password to set.
 * @returns An object indicating whether the password change was successful.
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
