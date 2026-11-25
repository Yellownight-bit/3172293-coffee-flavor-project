
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { showConfirmDeactivateAlert } from "@/shared/services/alertService";

export default function StatusSwitch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
}) {
  const [isActive, setIsActive] = useState(checked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsActive(checked);
  }, [checked]);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    const newValue = !isActive;

    // Confirmar antes de desactivar
    if (isActive) {
      const result = await showConfirmDeactivateAlert();

      if (!result.isConfirmed) return;
    }

    if (!onChange) return;

    try {
      setIsLoading(true);

      // El componente padre realiza la actualización en la base de datos
      await onChange(newValue);
    } finally {
      setIsLoading(false);
    }
  };

  const sizes = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-7 w-14",
  };

  const knobSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center
        rounded-full transition-colors
        ${sizes[size]}
        ${isActive ? "bg-brand-strong" : "bg-surface-muted"}
        ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          absolute left-0.5 flex items-center justify-center
          rounded-full bg-panel shadow
          transition-transform
          ${knobSizes[size]}
          ${isActive ? "translate-x-full" : "translate-x-0"}
        `}
      >
        {isActive ? (
          <Check size={12} className="text-brand-strong" />
        ) : (
          <X size={12} className="text-text-muted" />
        )}
      </span>
    </button>
  );
}
