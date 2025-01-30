"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Scale, Ruler, CalendarIcon, InfoIcon as Id, Camera } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/utils/supabase/client";
import EditField from "../components/EditField";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editFormSchema, TEditForm } from "../schemas/edit-form-schema";
import { User } from "@supabase/supabase-js";
import { editProfileAction } from "../actions";
import { BadgeMessage } from "../components/BadgeMessage";
import ProfileSectionCard from "../components/ProfileSectionCard";
import Link from "next/link";

interface userProfile {
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  phone: string;
  level?: string;
  shift?: string;
  avatar_url?: string;
  birth_date?: string;
  dni?: string;
  weight?: number;
  height?: number;
}
enum LevelToSpanish {
  beginner = "Principiante",
  intermediate = "Intermedio",
  advanced = "Avanzado",
}

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<userProfile>();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"success" | "error">("success");
  const [isVisible, setIsVisible] = useState(false);
  const [athlete, setAthlete] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data?.user?.id)
          .single();
        const { data: athleteData, error: err } = await supabase
          .from("athletes")
          .select("*")
          .eq("athlete_id", profile?.id)
          .single();

        if (err) {
          console.log("Error loading athlete:", err);
        }
        setUser(data?.user);
        setUserProfile(profile);
        setAthlete(athleteData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);
  const { control, handleSubmit, reset, watch } = useForm<TEditForm>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      firstName: "",
      paternalLastName: "",
      maternalLastName: "",
      phone: "",
    },
  });

  // ⬇️ Cuando el usuario se obtiene de Supabase, actualiza el formulario con `reset`
  useEffect(() => {
    if (userProfile) {
      reset({
        firstName: userProfile?.first_name || "",
        paternalLastName: userProfile?.paternal_last_name || "",
        maternalLastName: userProfile?.maternal_last_name || "",
        phone: userProfile?.phone || "",
      });
    }
  }, [userProfile, reset, user]);

  // ⬇️ Verifica si los valores actuales son iguales a los iniciales
  const watchedValues = useWatch({ control });
  const hasChanges =
    JSON.stringify(watchedValues) !==
    JSON.stringify({
      firstName: userProfile?.first_name || "",
      paternalLastName: userProfile?.paternal_last_name || "",
      maternalLastName: userProfile?.maternal_last_name || "",
      phone: userProfile?.phone || "",
    });

  const onSubmit = async (data: TEditForm) => {
    try {
      setPendingUpdate(true);
      const res = await editProfileAction(data);
      if (res.status !== 200) {
        setSaveStatus("error");
      }
      setUserProfile({
        first_name: data.firstName,
        paternal_last_name: data.paternalLastName,
        maternal_last_name: data.maternalLastName,
        phone: data.phone,
        level: userProfile?.level,
        shift: userProfile?.shift,
      });
      setMessage(res.message);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setMessage("");
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error al actualizar el usuario");
    } finally {
      setPendingUpdate(false);
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    // ⬇️ Si está editando y hay cambios, resetea los valores del formulario
    if (isEditing && hasChanges) {
      reset({
        firstName: userProfile?.first_name || "",
        paternalLastName: userProfile?.paternal_last_name || "",
        maternalLastName: userProfile?.maternal_last_name || "",
        phone: userProfile?.phone || "",
      });
    }
    setIsEditing((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center dark:bg-[#181818]">
        <div className="size-16 animate-spin rounded-full border-y-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-background p-8 transition-colors duration-300 dark:bg-[#181818]">
      <TooltipProvider>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Perfil de Deportista</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleClick}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>

          <div className="grid h-full gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="col-span-1">
                <CardHeader className="pb-0">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="size-32 border-4 border-primary/10">
                        <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.first_name} />
                        <AvatarFallback>
                          {userProfile?.first_name[0]}
                          {userProfile?.paternal_last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="icon"
                          className="absolute bottom-0 right-0 rounded-full"
                          variant="secondary"
                        >
                          <Camera className="size-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-1 text-center">
                      <h2 className="text-xl font-semibold">
                        {userProfile?.first_name} {userProfile?.paternal_last_name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.maternal_last_name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {athlete?.level &&
                          LevelToSpanish[athlete?.level as keyof typeof LevelToSpanish]}
                      </Badge>
                      <Badge variant="default">
                        <Link href="/dashboard/athlete/schedule">Ver Horario</Link>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <ProfileSectionCard
                      icon={Scale}
                      label="Peso"
                      value={userProfile?.weight ? `${userProfile?.weight} kg` : "En proceso ..."}
                    />
                    <ProfileSectionCard
                      icon={Ruler}
                      label="Altura"
                      value={userProfile?.height ? `${userProfile?.height} cm` : "En proceso ..."}
                    />
                    <ProfileSectionCard icon={Id} label="DNI" value={user?.user_metadata?.dni} />
                    <ProfileSectionCard
                      icon={CalendarIcon}
                      label="Año de Nacimiento"
                      value={2006} // -> 25
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-2"
            >
              <Card>
                <CardHeader>
                  <h3 className="text-2xl font-semibold">Información Personal</h3>
                </CardHeader>
                <CardContent>
                  <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                      <EditField
                        control={control}
                        name="firstName"
                        label="Nombres"
                        value={watch("firstName")}
                        disabled={!isEditing}
                      />
                      <EditField
                        control={control}
                        name="paternalLastName"
                        label="Apellido Paterno"
                        value={watch("paternalLastName")}
                        disabled={!isEditing}
                      />
                      <EditField
                        control={control}
                        name="maternalLastName"
                        label="Apellido Paterno"
                        value={watch("maternalLastName")}
                        disabled={!isEditing}
                      />
                      <EditField
                        control={control}
                        name="phone"
                        label="Teléfono"
                        defaultValue={watch("phone")}
                        disabled={!isEditing}
                      />
                      <EditField
                        label="Email"
                        htmlFor="email"
                        disabled
                        defaultValue={user?.email}
                      />
                    </div>
                    {isEditing && (
                      <Button
                        type="submit"
                        className="w-full"
                        variant={"default"}
                        disabled={!hasChanges}
                      >
                        {pendingUpdate ? (
                          <div>
                            <div className="size-4 animate-spin rounded-full border-y-2 text-black dark:border-black "></div>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    )}
                    {isVisible && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeInOut",
                        }}
                      >
                        <BadgeMessage
                          variant={saveStatus}
                          className="mt-4"
                          message={message || ""}
                        />
                      </motion.div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
