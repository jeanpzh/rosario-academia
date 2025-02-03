import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, HelpCircle, PhoneCall } from "lucide-react";

export function BenefitsSection() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2" />
            Beneficios de tu matrícula
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc">
            <li>Acceso a todas las clases</li>
            <li>Materiales de estudio</li>
            <li>Asesoría académica</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2" />
            Ayuda sobre pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Si tienes dudas sobre tus pagos, visita nuestra sección de Preguntas Frecuentes.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PhoneCall className="mr-2" />
            Contáctanos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>¿Problemas con tu pago? Llámanos al 0800-00000 o escríbenos a ayuda@universidad.edu</p>
        </CardContent>
      </Card>
    </div>
  );
}
