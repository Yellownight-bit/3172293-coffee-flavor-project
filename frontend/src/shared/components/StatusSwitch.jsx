// Componente StatusSwitch
// Interruptor de estado (activo/inactivo) alineado a Material Design 3 (versión con íconos):
// - Pista de 52 x 32 px con borde, perilla de 24 px, área táctil de 48 px.
// - Colores solo con tokens: brand cuando está activo, border-strong cuando está inactivo.
// - Accesibilidad: role="switch", aria-checked, nombre accesible y aria-busy al guardar.
// - Controlado: el valor visible siempre es `checked`; el padre lo actualiza tras guardar.
import { useState } from "react";
import { Check, X, LoaderCircle } from "lucide-react";
import { showConfirmDeactivateAlert } from "@/shared/services/alertService";

export default function StatusSwitch({
  checked = false,
  onChange,                    // async (nuevoValor) => guarda en el backend
  disabled = false,
  label = "Estado activo",     // Nombre que lee el lector de pantalla
  confirmOnDeactivate = true,  // Pide confirmación antes de desactivar
}) {
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = disabled || isLoading;

  const handleToggle = async () => {
    if (isDisabled || !onChange) return;

    // Confirmar antes de desactivar
    if (checked && confirmOnDeactivate) {
      const result = await showConfirmDeactivateAlert();
      if (!result.isConfirmed) return;
    }

    try {
      setIsLoading(true);
      await onChange(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-busy={isLoading || undefined}
      onClick={handleToggle}
      disabled={isDisabled}
      className={`
        relative inline-flex h-8 w-13 shrink-0 items-center
        rounded-full border-2 transition-colors
        before:absolute before:-inset-y-2 before:inset-x-0 before:content-['']
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
        focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${checked ? "border-brand bg-brand" : "border-border-strong bg-panel-muted"}
        ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      `}
    >
      {/* Perilla */}
      <span
        aria-hidden="true"
        className={`
          absolute left-0.5 flex size-6 items-center justify-center
          rounded-full shadow-sm transition-transform
          ${checked ? "translate-x-5.5 bg-on-brand" : "translate-x-0 bg-border-strong"}
        `}
      >
        {isLoading ? (
          <LoaderCircle
            size={16}
            className={`animate-spin ${checked ? "text-brand" : "text-panel"}`}
          />
        ) : checked ? (
          <Check size={16} className="text-brand" />
        ) : (
          <X size={16} className="text-panel" />
        )}
      </span>
    </button>
  );
}