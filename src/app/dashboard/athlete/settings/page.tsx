"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, LogOut, Eye, EyeOff, Download } from "lucide-react";
import { BadgeMessage } from "../components/BadgeMessage";

export default function SettingsPage() {
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    // Simulación de guardado
    const isSuccess = Math.random() > 0.5;
    setSaveStatus(isSuccess ? "success" : "error");

    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Configuración de la Cuenta</h1>

      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <BadgeMessage
            variant={saveStatus}
            message={
              saveStatus === "success"
                ? "Configuración guardada exitosamente!"
                : "Error al guardar la configuración. Por favor, intente de nuevo."
            }
          />
        </motion.div>
      )}

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="security">Seguridad y Acceso</TabsTrigger>
          <TabsTrigger value="payments">Gestión de Pagos</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad y Acceso</CardTitle>
              <CardDescription>
                Administre la seguridad de su cuenta y controle el acceso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña actual"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Ingrese su nueva contraseña"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirme su nueva contraseña"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">Activar autenticación en dos pasos</Label>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="access-history">
                  <AccordionTrigger>Ver historial de accesos</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Dispositivo</TableHead>
                          <TableHead>Ubicación</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>2023-05-01 14:30</TableCell>
                          <TableCell>iPhone 12</TableCell>
                          <TableCell>Lima, Perú</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2023-04-28 09:15</TableCell>
                          <TableCell>MacBook Pro</TableCell>
                          <TableCell>Lima, Perú</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSave}>
                Guardar Cambios
              </Button>
              <Button variant="destructive">
                <LogOut className="mr-2 size-4" />
                Cerrar sesión en todos los dispositivos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Pagos</CardTitle>
              <CardDescription>
                Administre sus métodos de pago e historial de transacciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payment-history">
                  <AccordionTrigger>Ver historial de pagos</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>2023-05-01</TableCell>
                          <TableCell>Inscripción Mayo</TableCell>
                          <TableCell>S/. 150.00</TableCell>
                          <TableCell>Pagado</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 size-4" />
                              Recibo
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2023-04-01</TableCell>
                          <TableCell>Inscripción Abril</TableCell>
                          <TableCell>S/. 150.00</TableCell>
                          <TableCell>Pagado</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 size-4" />
                              Recibo
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="space-y-2">
                <Label>Métodos de pago guardados</Label>
                <div className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 size-5" />
                    <span>Visa terminada en 1234</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Eliminar
                  </Button>
                </div>
              </div>
              <Button>Agregar nuevo método de pago</Button>
              <div className="mt-4">
                <Label>Estado de inscripción</Label>
                <p className="mt-1 text-sm text-muted-foreground">Activo hasta: 31 de Mayo, 2023</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Personalice cómo y cuándo recibe notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">
                    Notificaciones por correo electrónico
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Reciba actualizaciones importantes por correo.
                  </p>
                </div>
                <Switch id="email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="payment-reminders" className="text-base">
                    Recordatorios de pago
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Reciba alertas antes del vencimiento de pagos.
                  </p>
                </div>
                <Switch id="payment-reminders" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="account-alerts" className="text-base">
                    Alertas de seguridad
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones sobre cambios en el perfil o accesos a la cuenta.
                  </p>
                </div>
                <Switch id="account-alerts" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Guardar Preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
