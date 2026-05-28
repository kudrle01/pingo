import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-gray-300 tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded-2xl bg-surface-700 border border-white/10 px-4 py-3 text-white placeholder-gray-500",
            "focus:outline-none focus:border-violet-500/80 focus:ring-2 focus:ring-violet-500/30 focus:bg-surface-600",
            "transition-all duration-200",
            error ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
