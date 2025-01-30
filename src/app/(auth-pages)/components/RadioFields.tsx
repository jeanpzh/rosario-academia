import React from "react";
import { Controller, Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioFieldProps {
  control: Control<any>;
  name: string;
  labelText?: string;
}

const LEVELS = [
  { id: "beginner", name: "Básico", description: "14:00 - 15:30 (Lunes, Miércoles, Viernes)" },
  {
    id: "intermediate",
    name: "Intermedio",
    description: "15:30 - 17:00 (Lunes, Miércoles, Viernes)",
  },
  { id: "advanced", name: "Avanzado", description: "17:00 - 18:30 (Lunes, Miércoles, Viernes)" },
];

export default function RadioFields({ control, name, labelText }: RadioFieldProps) {
  return (
    <div>
      {labelText && <Label className="text-sm text-gray-700 dark:text-gray-300">{labelText}</Label>}
      <Controller
        name={name}
        control={control}
        defaultValue="beginner"
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            {LEVELS.map((level) => (
              <div
                key={level.id}
                className="flex items-center space-x-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-black/50"
              >
                <RadioGroupItem
                  value={level.id}
                  id={level.id}
                  className="border-gray-300 text-green-500 focus:ring-green-500"
                />
                <Label htmlFor={level.id} className="flex cursor-pointer flex-col gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{level.name}</span>
                  <span className="text-white">{level.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  );
}
