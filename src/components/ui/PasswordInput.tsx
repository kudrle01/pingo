import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/i18n/LanguageProvider";
import { Eye, EyeOff, Lock } from "lucide-react";
import { type ComponentProps, useState } from "react";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

export function PasswordInput({ className = "", ...props }: PasswordInputProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <Input
        type={visible ? "text" : "password"}
        className={`pl-9 pr-10 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={t("common.togglePassword")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
