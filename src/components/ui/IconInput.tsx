import { Input } from "@/components/ui/Input";
import type { ComponentProps, ReactNode } from "react";

interface IconInputProps extends ComponentProps<typeof Input> {
  icon: ReactNode;
}

export function IconInput({ icon, className = "", ...props }: IconInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        {icon}
      </span>
      <Input className={`pl-9 ${className}`} {...props} />
    </div>
  );
}
