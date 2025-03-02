"use server";
import { uploadImage } from "@/lib/cloudinary";
import { createClient } from "@/utils/supabase/server";

export const saveAvatar = async (
  blob: Blob | null,
  id?: string,
): Promise<{ status: number; message: string; data?: string }> => {
  try {
    if (!blob) return { status: 400, message: "No se ha seleccionado una imagen" };
    const buffer = Buffer.from(await blob.arrayBuffer());
    const res = await uploadImage(buffer);
    const supabase = await createClient();
    let userId;
    if (id) userId = id;
    else {
      const { data: session, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) return { status: 500, message: "Error al obtener la sesión" };
      userId = session?.user.id;
    }
    console.log({ userId });

    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar_url: res.secure_url,
        last_avatar_change: new Date(),
      })
      .match({ id: userId });

    if (error) {
      console.log(error);
      return { status: 500, message: "Error al guardar la imagen" };
    }
    console.log({ data });
    return { status: 200, message: "Imagen guardada correctamente", data: res.secure_url };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Error al guardar la imagen" };
  }
};
