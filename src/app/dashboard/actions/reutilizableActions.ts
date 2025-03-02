import { Resend } from "resend";

/**
 * Send an email with the assistant's credentials using Resend.
 *
 * @param recipientEmail - The email address to send to.
 * @param firstName - The first name of the assistant.
 * @param defaultPassword - The default password generated.
 * @throws An error if sending the email fails.
 */

export const sendEmail = async (
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
