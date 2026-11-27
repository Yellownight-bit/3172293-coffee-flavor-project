// Componente Input
// Campo de texto alineado a Material Design 3 (mismo estilo que Select):
// - Colores: solo tokens semánticos, cambian solos con el tema claro/oscuro.
// - Estados: hover, focus, disabled y error.
// - Medidas: alto de 56 px, ancho fluido (mínimo 200 px), 4 px entre label y campo.
// - Accesibilidad: label conectado al input, error anunciado y ligado con aria-describedby.
import { useId } from "react";

export default function Input({
  label,
  error,
  htmlFor,
  type = "text",
  className = "",
  ...props
}) {
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

      <input
        {...props}
        id={inputId}
        type={type}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`
          h-14
          w-full
          rounded-sm
          border
          bg-panel
          px-4
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

      {/* Mensaje de error */}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}