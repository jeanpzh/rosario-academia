"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordVisualizerProps {
  inputId: string;
}

export function PasswordVisualizer({ inputId }: PasswordVisualizerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.type = isVisible ? "password" : "text";
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-2 top-1/2 -translate-y-1/4"
      onClick={toggleVisibility}
    >
      {isVisible ? <EyeOff className="size-2" /> : <Eye className="size-2" />}
      <span className="sr-only">{isVisible ? "Hide password" : "Show password"}</span>
    </Button>
  );
}
