// Componente Select

import { useId } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  error,
  htmlFor,
  name,
  onChange,
  value,
  options = [],
  placeholder = "Seleccione una opción",
  className = "",
  ...props
}) {
  // El id conecta el label con el select. Si la vista no envía htmlFor ni name, se genera uno único.
  const autoId = useId();
  const selectId = htmlFor ?? name ?? autoId;
  const errorId = `${selectId}-error`;

  // Si no hay label visible, el lector de pantalla usa el aria-label o el placeholder.
  const ariaLabel = label ? undefined : (props["aria-label"] ?? placeholder);

  return (
    <div className={`w-full min-w-50 ${className}`}>
      {/* Label: solo se muestra si la vista lo envía */}
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1 block text-small text-text-secondary"
        >
          {label}
        </label>
      )}

      {/* Contenedor relativo para ubicar la flecha */}
      <div className="relative">
        <select
          {...props}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`
            h-14
            w-full
            cursor-pointer
            appearance-none
            rounded-sm
            border
            bg-panel
            pl-4
            pr-12
            text-body
            text-text-primary
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
        >
          <option value="">{placeholder}</option>

          {options.map((opt, index) => (
            <option key={`${opt.value}-${index}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Flecha decorativa (M3 trailing icon) */}
        <ChevronDown
          aria-hidden="true"
          size={20}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />
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