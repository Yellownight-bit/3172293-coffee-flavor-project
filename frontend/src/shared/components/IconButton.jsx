// Componente IconButton
// Botón de solo ícono alineado a Material Design 3:
// - Contenedor visible de 40 px (md) o 32 px (sm) y área táctil mínima de 48 px (::before).
// - Ícono de 24 px para todos los usos.
// - Variantes con tokens: standard (transparente) y filled (color de marca).
// - Estado seleccionado (isActive) con aria-pressed, solo cuando la vista lo usa.
// - React 19: `ref` llega como prop normal; {...props} permite que DropdownTrigger
//   agregue onClick, aria-expanded y aria-haspopup.
import clsx from "clsx";

const baseStyles = `
  relative inline-flex shrink-0 items-center justify-center rounded-full
  transition-colors
  before:absolute before:content-['']
  [&_svg]:size-6
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
  focus-visible:ring-offset-2 focus-visible:ring-offset-background
  disabled:cursor-not-allowed disabled:opacity-50
`;

const sizeStyles = {
  sm: "size-8 before:-inset-2",   // 32 px visible + 48 px táctil
  md: "size-10 before:-inset-1",  // 40 px visible + 48 px táctil
};

const variantStyles = {
  standard: "text-text-secondary enabled:hover:bg-panel-muted enabled:hover:text-text-primary",
  filled: "bg-brand text-on-brand enabled:hover:bg-brand-hover",
};

// Alias para no romper usos anteriores
const variantAlias = {
  default: "standard",
  ghost: "standard",
  primary: "filled",
};

export function IconButton({
  ref,
  children,
  ariaLabel,              // Obligatorio: el botón no tiene texto visible
  variant = "standard",
  size = "md",
  isActive,               // true/false = botón de alternar; sin valor = botón normal
  disabled = false,
  className = "",
  ...props                // onClick, aria-expanded, etc.
}) {
  const resolvedVariant = variantAlias[variant] ?? variant;

  return (
    <button
      type="button"
      {...props}
      ref={ref}
      aria-label={ariaLabel ?? props["aria-label"]}
      aria-pressed={isActive}
      disabled={disabled}
      className={clsx(
        baseStyles,
        sizeStyles[size] ?? sizeStyles.md,
        isActive
          ? "bg-brand-soft text-brand"
          : variantStyles[resolvedVariant] ?? variantStyles.standard,
        className
      )}
    >
      {children}
    </button>
  );
}

export default IconButton;