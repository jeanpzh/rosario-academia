"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import AvatarEditor from "react-avatar-editor";
import { saveAvatar } from "@/app/dashboard/athlete/profile/actions";
import { toast } from "sonner";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import { getDaysRemaining } from "@/utils/formats";
import LockedAvatarPage from "../components/locked-avatar-page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AvatarUploadPage() {
  const { setImg, athlete } = useAthleteStore();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editor, setEditor] = useState<AvatarEditor | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } catch (error) {
      toast.error("Error", {
        description: "Por favor, cargue un archivo de imagen válido.",
        duration: 5000,
      });
      return;
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
  });

  const handleSave = () => {
    if (!editor) return;
    setIsConfirmDialogOpen(false);
    const canvas = editor.getImageScaledToCanvas();
    canvas.toBlob(async (blob: Blob | null) => {
      // Guardar la foto y mostrar el toast
      toast.promise(saveAvatar(blob), {
        loading: "Guardando foto...",
        success: (res) => {
          setImg(res.data as string);
          return res.message;
        },
        error: (err) => err.message,
      });
      // Si fue exitoso, redirecciona al perfil
      router.push("/dashboard/athlete/profile");
    });
  };

  // lastChange es la fecha del último cambio, disponible en el estado global del atleta
  const lastChange = athlete?.profile.last_avatar_change;

  // Calcula los días restantes para poder cambiar la foto (espera 30 días)
  const daysRemaining = getDaysRemaining(lastChange as string);

  return (
    <>
      {daysRemaining === 0 ? (
        <div className="min-h-screen bg-background p-8 transition-colors duration-300 dark:bg-[#181818]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl"
          >
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
              <ArrowLeft className="mr-2 size-4" /> Volver
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Subir Foto de Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 text-sm text-muted-foreground">
                  <h3 className="mb-2 font-semibold">Instrucciones para la foto:</h3>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Usa una foto de primer plano de tu rostro</li>
                    <li>Asegúrate de tener buena iluminación</li>
                    <li>Tu rostro debe ser claramente visible</li>
                    <li>Usa vestimenta apropiada para un carnet</li>
                    <li>El archivo no debe exceder 5MB</li>
                  </ul>
                </div>

                {!image ? (
                  <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                      isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto mb-4 size-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Arrastra y suelta tu foto aquí, o haz clic para seleccionar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AvatarEditor
                      ref={(ref: any) => setEditor(ref)}
                      image={preview!}
                      width={250}
                      height={250}
                      border={50}
                      color={[255, 255, 255, 0.6]}
                      scale={1.2}
                      rotate={0}
                      className="mx-auto"
                    />
                    <div className="flex justify-center space-x-4">
                      <Button onClick={() => setImage(null)} variant="outline">
                        Cambiar foto
                      </Button>
                      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Camera className="mr-2 size-4" /> Guardar foto
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar subida de foto</DialogTitle>
                            <DialogDescription>
                              ¿Estás seguro de que quieres subir esta foto? No podrás cambiarla
                              durante 1 mes.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleSave}>Confirmar y subir</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <LockedAvatarPage daysRemaining={daysRemaining} />
      )}
    </>
  );
}
