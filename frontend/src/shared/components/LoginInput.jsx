
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, CircleAlert } from "lucide-react";

export default function LoginInput({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  error,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const Icon = isPassword ? Lock : Mail;

  return (
    <div className="w-full min-w-0">
      <label
        htmlFor={name}
        className="block text-xs font-medium text-[var(--color-primary-950)] mb-1"
      >
        {label}
      </label>

      <div
        className={`relative flex items-center w-full h-12 rounded-lg border transition-colors ${
          error
            ? "border-red-600"
            : "border-[var(--color-primary-800)] hover:border-[var(--color-primary-950)] focus-within:border-[var(--color-primary-950)]"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <Icon
          size={24}
          strokeWidth={1.8}
          className="ml-3 shrink-0 text-[var(--color-primary-800)]"
        />

        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className="w-full h-full min-w-0 px-4 bg-transparent outline-none text-[var(--color-primary-950)] placeholder:text-[var(--color-primary-800)]/60 text-base disabled:cursor-not-allowed"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="flex items-center justify-center min-w-12 h-full shrink-0 rounded-r-lg text-[var(--color-primary-800)] hover:text-[var(--color-primary-950)] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--color-primary-700)] disabled:cursor-not-allowed"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            title={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff size={24} strokeWidth={1.8} />
            ) : (
              <Eye size={24} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-600 mt-1"
        >
          <CircleAlert size={14} strokeWidth={2} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
