// Componente Dropdown

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  cloneElement,
} from "react";
import { Link } from "react-router-dom";

export const DropdownContext = createContext(null);

export function Dropdown({
  children,
  open: controlledOpen,
  onOpenChange,
  className = "",
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const contentId = useId();

  const setOpen = (value) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setUncontrolledOpen(value);
    }
  };

  // Cerrar con clic fuera o con Escape (solo mientras está abierto)
  useEffect(() => {
    if (!open) return;

    const close = () => {
      if (isControlled) {
        onOpenChange?.(false);
      } else {
        setUncontrolledOpen(false);
      }
    };

    const handleMouseDown = (e) => {
      if (!containerRef.current?.contains(e.target)) close();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isControlled, onOpenChange]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef, contentId }}>
      <div
        ref={containerRef}
        className={`relative inline-block ${className}`}
        // Cerrar si el foco sale del menú con Tab
        onBlur={(e) => {
          if (open && !e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// Trigger: agrega al hijo (por ejemplo IconButton) el clic, la ref y los atributos ARIA
export function DropdownTrigger({ children }) {
  const { open, setOpen, triggerRef, contentId } = useContext(DropdownContext);

  if (!children) return null;

  return cloneElement(children, {
    ref: triggerRef,
    onClick: (e) => {
      children.props.onClick?.(e);
      setOpen(!open);
    },
    "aria-expanded": open,
    "aria-controls": contentId,
  });
}

// Contenido: panel con la lista de opciones
export function DropdownContent({ children, className = "", align = "end" }) {
  const { open, contentId } = useContext(DropdownContext);

  if (!open) return null;

  return (
    <div
      id={contentId}
      className={`
        absolute top-full z-50 mt-2 min-w-56
        overflow-hidden rounded-sm border border-border bg-panel py-2
        text-text-primary shadow-lg
        ${align === "end" ? "right-0" : "left-0"}
        ${className}
      `}
    >
      <ul className="flex flex-col">{children}</ul>
    </div>
  );
}

// Ítem: Link si recibe `to`, botón si no. `className` se aplica al <li>.
export function DropdownItem({ children, to, onClick, className = "" }) {
  const { setOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    onClick?.(e);
    setOpen(false);
  };

  const itemStyles = `
    flex min-h-12 w-full items-center gap-3 px-4 text-left
    text-medium text-text-primary transition-colors
    hover:bg-panel-muted
    focus-visible:bg-panel-muted focus-visible:outline-none
    [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-text-secondary
  `;

  return (
    <li className={className}>
      {to ? (
        <Link to={to} onClick={handleClick} className={itemStyles}>
          {children}
        </Link>
      ) : (
        <button type="button" onClick={handleClick} className={itemStyles}>
          {children}
        </button>
      )}
    </li>
  );
}