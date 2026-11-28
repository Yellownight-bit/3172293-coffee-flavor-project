// Componente Input

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  error,
  htmlFor,
  type = "text",
  leadingIcon: LeadingIcon, // Componente de ícono, ej. Mail de lucide-react
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  // El id conecta el label con el input. Si la vista no envía htmlFor ni name, se genera uno único.
  const autoId = useId();
  const inputId = htmlFor ?? props.name ?? autoId;
  const errorId = `${inputId}-error`;

  // Si no hay label visible, el lector de pantalla usa el aria-label o el placeholder.
  const ariaLabel = label ? undefined : (props["aria-label"] ?? props.placeholder);

  return (
    <div className={`w-full min-w-50 ${className}`}>
      {/* Label: solo se muestra si la vista lo envía */}
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-small text-text-secondary"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Ícono inicial (decorativo) */}
        {LeadingIcon && (
          <LeadingIcon
            aria-hidden="true"
            strokeWidth={1.8}
            className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-text-secondary"
          />
        )}

        <input
          {...props}
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`
            h-12
            w-full
            rounded-sm
            border
            bg-panel
            ${LeadingIcon ? "pl-14" : "pl-4"}
            ${isPassword ? "pr-12" : "pr-4"}
            text-body
            text-text-primary
            placeholder:text-text-muted
            transition-colors
            focus:outline-none
            focus:ring-1
            disabled:cursor-not-allowed
            disabled:bg-panel-muted
            disabled:text-text-muted
            ${
              error
                ? "border-error focus:ring-error"
                : "border-border enabled:hover:border-border-strong focus:border-focus-border focus:ring-focus-border"
            }
          `}
        />

        {/* Mostrar / ocultar contraseña */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={props.disabled}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="
              absolute right-0 top-0 flex size-12 items-center justify-center rounded-r-sm
              text-text-secondary transition-colors
              enabled:hover:text-text-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring
              disabled:cursor-not-allowed
            "
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" strokeWidth={1.8} className="size-6" />
            ) : (
              <Eye aria-hidden="true" strokeWidth={1.8} className="size-6" />
            )}
          </button>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}