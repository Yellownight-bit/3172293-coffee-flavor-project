// Componente Checkbox

export default function Checkbox({
  id,                 // Identificador único (conecta el label con la casilla)
  name,               // Nombre del campo en el formulario
  label,              // Texto visible de la casilla
  value,
  checked = false,    // Estado controlado
  onChange,           // Función que maneja el cambio
  disabled = false,   // Deshabilita la casilla
  className = "",     // Clases extra para el contenedor
  ...props            // required, aria-describedby, etc.
}) {
  return (
    <label
      htmlFor={id}
      className={`
        inline-flex
        min-h-12
        items-center
        gap-3
        text-medium
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Casilla nativa pintada con el color de marca */}
      <input
        {...props}
        id={id}
        name={name}
        type="checkbox"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="
          size-4.5
          shrink-0
          accent-brand
          cursor-[inherit]
          rounded-xs
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-focus-ring
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
        "
      />
      
      {/* Texto de la casilla */}
      <span>{label}</span>
    </label>
  );
}