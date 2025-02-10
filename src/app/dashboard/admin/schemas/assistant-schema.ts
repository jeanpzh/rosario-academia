import * as z from "zod";

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
const dniRegex = /^\d{8}$/;

export const assistantFormSchema = z.object({
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  paternal_last_name: z
    .string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(50, "El apellido paterno no puede exceder 50 caracteres"),
  maternal_last_name: z
    .string()
    .min(2, "El apellido materno debe tener al menos 2 caracteres")
    .max(50, "El apellido materno no puede exceder 50 caracteres"),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  dni: z.string().regex(dniRegex, "DNI debe tener 8 dígitos"),
  avatar_url: z.string().url("URL de avatar inválida").optional(),
  phone: z.string().regex(phoneRegex, "Número de teléfono inválido"),
  email: z.string().email("Correo electrónico inválido"),
});

export type AssistantFormData = z.infer<typeof assistantFormSchema>;
