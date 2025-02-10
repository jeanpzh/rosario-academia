import * as z from "zod";

export const athleteFormSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido"),
  paternal_last_name: z.string().min(1, "El apellido paterno es requerido"),
  maternal_last_name: z.string().min(1, "El apellido materno es requerido"),
  birth_date: z.string().min(1, "La fecha de nacimiento es requerida"),
  dni: z.string().min(1, "El DNI es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Correo electrónico inválido").nullable().optional(),
  avatar_url: z.string().url("URL de avatar inválida").nullable().optional(),
});

export type AthleteFormData = z.infer<typeof athleteFormSchema>;
