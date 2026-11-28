// Componente SearchField
// Barra de búsqueda alineada a Material Design 3:
// - Forma de píldora, 48 px (md) o 40 px (sm), íconos de 20 px.
// - Colores solo con tokens: borde sutil y color de foco al enfocar.
// - Accesibilidad: role="search", botón limpiar de 48 px de área táctil que devuelve el foco al campo.
// - React 19: `ref` llega como prop normal (sin forwardRef).
import { useImperativeHandle, useRef } from "react";
import { Search, X, LoaderCircle } from "lucide-react";
import clsx from "clsx";

const baseStyles =
  "flex items-center gap-3 rounded-full border px-4 transition-colors";

const sizeStyles = {
  sm: "h-10",
  md: "h-12",
  lg: "h-12", // Alias de md (compatibilidad)
};

const variantStyles = {
  // Filled: fondo relleno y borde invisible hasta el hover
  filled: "bg-panel-muted border-transparent hover:border-border",
  // Outlined: fondo del panel y borde visible siempre
  outlined: "bg-panel border-border hover:border-border-strong",
};

export default function SearchField({
  ref,
  value = "",
  placeholder = "Buscar",
  onChange = () => {},
  onSubmit,
  onClear = () => {},
  size = "md",
  variant = "filled",
  fullWidth = false,
  disabled = false,
  loading = false,
  error = false,
  name = "search",
  ariaLabel,
  autoComplete = "off",
  icon,
  className,
}) {
  const SearchIcon = icon || Search;

  // Ref interna para devolver el foco al limpiar; se expone hacia afuera con `ref`
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current, []);

  const handleClear = () => {
    onChange("");
    onClear();
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled || loading) return;
    onSubmit?.(value);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      aria-busy={loading || undefined}
      className={clsx(
        baseStyles,
        sizeStyles[size] ?? sizeStyles.md,
        variantStyles[variant] ?? variantStyles.filled,
        fullWidth && "w-full",
        disabled && "cursor-not-allowed opacity-50 hover:border-transparent",
        error
          ? "border-error focus-within:ring-1 focus-within:ring-error"
          : "focus-within:border-focus-border focus-within:ring-1 focus-within:ring-focus-border",
        className
      )}
    >
      {/* Ícono de búsqueda o de carga */}
      {loading ? (
        <LoaderCircle aria-hidden="true" className="size-5 shrink-0 animate-spin text-text-muted" />
      ) : (
        <SearchIcon aria-hidden="true" className="size-5 shrink-0 text-text-secondary" />
      )}

      <input
        ref={inputRef}
        type="search"
        name={name}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        aria-invalid={error || undefined}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="
          min-w-0 flex-1 bg-transparent text-medium text-text-primary
          placeholder:text-text-muted outline-none
          disabled:cursor-not-allowed
          [&::-webkit-search-cancel-button]:appearance-none
        "
      />

      {/* Limpiar: 32 px visibles, 48 px de área táctil */}
      {!!value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="
            relative -mr-2 flex size-8 shrink-0 items-center justify-center rounded-full
            text-text-secondary transition-colors
            before:absolute before:-inset-2 before:content-['']
            hover:bg-panel-muted hover:text-text-primary
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
          "
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      )}
    </form>
  );
}