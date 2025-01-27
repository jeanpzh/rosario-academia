import React from "react";
import { Controller, Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioFieldProps {
  control: Control<any>;
  name: string;
  items: { id: string; name: string; description: string }[];
  labelText?: string;
}

export default function RadioFields({ control, name, items, labelText }: RadioFieldProps) {
  return (
    <div>
      {labelText && <Label className="text-sm text-gray-700 dark:text-gray-300">{labelText}</Label>}
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={(value) => field.onChange(value)}>
            {items.map((item) => (
              <div
                key={item.id}
                className="dark:hover:bg-dark-100 flex items-center space-x-2 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-black/50"
              >
                <RadioGroupItem
                  value={item.id}
                  id={item.id}
                  className="border-gray-300 text-green-500 focus:ring-green-500"
                />
                <Label htmlFor={item.id} className="flex cursor-pointer flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  );
}
