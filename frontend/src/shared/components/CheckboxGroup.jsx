// Componente CheckboxGroup
// Grupo de casillas con fieldset + legend para que el lector de pantalla
// anuncie el título del grupo. El error se muestra debajo y queda ligado al grupo.
import { Checkbox } from "@/shared";

export default function CheckboxGroup({
  label,
  name,
  options = [],
  value = [],
  onChange,
  error,
}) {
  const errorId = `${name}-error`;

  return (
    <fieldset
      className="flex flex-col gap-1"
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      {/* Título del grupo */}
      <legend className="mb-1 font-semibold text-text-secondary">
        {label}
      </legend>

      {/* Casillas */}
      <div className="grid grid-cols-2 gap-x-6">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            label={option.label}
            checked={value.includes(option.value)}
            onChange={onChange}
          />
        ))}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p id={errorId} role="alert" className="text-small text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}