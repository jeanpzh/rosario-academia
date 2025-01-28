import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ScheduleCard({ className }: { className?: string }) {
  const schedule = [
    { day: "Lunes", time: "18:00 - 19:30" },
    { day: "Miércoles", time: "18:00 - 19:30" },
    { day: "Viernes", time: "17:30 - 19:00" },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Mi Horario</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {schedule.map((session, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="font-medium">{session.day}</span>
              <span className="text-sm text-muted-foreground">{session.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
