"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TEditForm } from "@/app/dashboard/athlete/schemas/edit-form-schema";
import { useProfileData } from "./hooks/use-profile";
import { EditProfileForm } from "./components/EditProfileForm";
import { PersonalCard } from "./components/PersonalCard";
import { useAthleteStore } from "@/lib/stores/useUserStore";
import LoadingPage from "../components/LoadingPage";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, userProfile, athlete, loading, error, updateProfile } = useProfileData();

  const { setAthleteData, setDaysRemaining } = useAthleteStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (loading) return <LoadingPage />;

  if (error) {
    return <div>Ocurrió un error: {error}</div>;
  }

  const handleEditSubmit = async (data: TEditForm) => {
    try {
      setIsSaving(true);
      toast.promise(
        updateProfile({
          first_name: data.firstName,
          paternal_last_name: data.paternalLastName,
          maternal_last_name: data.maternalLastName,
          phone: data.phone,
        }),
        {
          loading: "Guardando cambios...",
          success: (res) => {
            setAthleteData({
              ...athlete,
              first_name: data.firstName,
              paternal_last_name: data.paternalLastName,
              maternal_last_name: data.maternalLastName,
              phone: data.phone,
            });
            setDaysRemaining(30);
            return res.message;
          },
          error: (err) => {
            return err.message || "Error al actualizar el perfil";
          },
        },
      );
    } catch (e: any) {
      toast.error("Error", {
        description: e.message || "Error al actualizar el perfil",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const defaultFormValues: TEditForm = {
    firstName: userProfile?.first_name || "",
    paternalLastName: userProfile?.paternal_last_name || "",
    maternalLastName: userProfile?.maternal_last_name || "",
    phone: userProfile?.phone || "",
  };

  return (
    <div className="h-full min-h-screen bg-background p-8 transition-colors duration-300 dark:bg-[#181818]">
      <TooltipProvider>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Perfil de Deportista</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isEditing}
              >
                {"Edit Profile"}
              </Button>
            </div>
          </div>

          <div className="grid h-full gap-8 md:grid-cols-3">
            <PersonalCard userProfile={userProfile!} athlete={athlete} isEditing={isEditing} />

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
                <EditProfileForm
                  defaultValues={defaultFormValues}
                  onSubmit={handleEditSubmit}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onCancelEdit={() => setIsEditing(false)}
                  user={user}
                  userProfile={userProfile}
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
