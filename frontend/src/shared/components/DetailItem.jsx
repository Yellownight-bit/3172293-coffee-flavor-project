// Componente DetailItem
// Fila "dato: valor" de las vistas de detalle, alineada a Material Design 3:
// - Jerarquía clara: label en text-secondary (semibold) y valor en text-primary.
// - Fila de mínimo 48 px; en pantallas angostas el valor baja debajo del label.
// - Si el valor viene vacío muestra un texto por defecto (fallback).
export default function DetailItem({
  label,
  value,
  fallback = "No registrado", // Texto cuando no hay dato (0 sí se muestra)
}) {
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border-soft py-3">
      <span className="text-medium font-semibold text-text-secondary">
        {label}
      </span>

      <span
        className={`min-w-0 break-words text-right text-medium ${
          isEmpty ? "italic text-text-muted" : "text-text-primary"
        }`}
      >
        {isEmpty ? fallback : value}
      </span>
    </div>
  );
}