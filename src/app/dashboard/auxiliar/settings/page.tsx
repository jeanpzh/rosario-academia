import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "@/app/dashboard/components/ChangePasswordForm";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6 p-10">
      <h1 className="text-3xl font-bold">Configuración</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
