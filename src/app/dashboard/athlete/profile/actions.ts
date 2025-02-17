"use server";
import { uploadImage } from "@/lib/cloudinary";
import { createClient } from "@/utils/supabase/server";

export const saveAvatar = async (
  blob: Blob | null,
): Promise<{ status: number; message: string; data?: string }> => {
  try {
    if (!blob) return { status: 400, message: "No se ha seleccionado una imagen" };
    const buffer = Buffer.from(await blob.arrayBuffer());
    const res = await uploadImage(buffer);
    const supabase = await createClient();

    const { data: session, error: sessionError } = await supabase.auth.getUser();
    if (sessionError) return { status: 500, message: "Error al obtener la sesión" };

    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_url: res.secure_url,
      })
      .match({ id: session?.user.id });

    if (error) {
      console.log(error);
      return { status: 500, message: "Error al guardar la imagen" };
    }
    return { status: 200, message: "Imagen guardada correctamente", data: res.secure_url };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Error al guardar la imagen" };
  }
};
