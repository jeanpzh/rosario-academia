import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Control } from "react-hook-form";

interface TextFieldProps extends React.HTMLProps<HTMLInputElement> {
  htmlFor: string;
  label: string;
  control: Control<any>;
  name: string;
}

export default function TextField({ htmlFor, label, control, name, ...props }: TextFieldProps) {
  const {
    _formState: { errors },
  } = control;
  return (
    <div className="mb-3 max-sm:w-[310px]">
      <Label htmlFor={htmlFor}>{label}</Label>
      <Input {...control.register(name)} {...props} />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {errors[name].message?.toString()}
        </p>
      )}
    </div>
  );
}
