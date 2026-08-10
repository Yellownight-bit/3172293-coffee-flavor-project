export default function OrderObservations({ observations }) {
  return (
    <div className="bg-surface rounded-2xl p-6 space-y-2 border border-border bg-white">
      {/* Título de la sección */}
      <h3 className="font-heading text-text-primary text-center text-title uppercase border-b border-border pb-2">
        Observaciones
      </h3>

      {/* Contenido de la observación */}
      <p className="text-small text-text-secondary italic text-center">
        {/* Si hay observaciones las muestra, si viene vacío muestra un texto por defecto */}
        {observations || "Sin observaciones registradas para esta orden."}
      </p>
    </div>
  );
}