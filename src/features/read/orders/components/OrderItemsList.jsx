export default function OrderItemsList({ items, subtotal, total }) {
  return (
    <div className="bg-surface rounded-2xl p-6 space-y-4 border border-border bg-white">
      <h3 className="font-heading text-text-primary text-center text-title uppercase border-b border-border pb-3">
        Platillos Solicitados
      </h3>

      {/* Recorremos la lista de platillos */}
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div key={item.id} className="py-2 flex justify-between items-center text-body">
            <div>
              <p className="font-heading text-text-primary">{item.name}</p>
              <p className="text-text-secondary text-small">
                Cantidad: <span className="font-heading text-text-primary">{item.quantity}</span>
              </p>
            </div>
            
            {/* Formateamos el precio total por platillo */}
            <div className="font-heading text-text-primary">
              ${item.total.toLocaleString("es-CO")}
            </div>
          </div>
        ))}
      </div>

      {/* Totales de la Orden */}
      <div className="pt-4 border-t-2 border-border space-y-2 text-body">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal:</span>
          <span>${subtotal.toLocaleString("es-CO")}</span>
        </div>
        
        <div className="flex justify-between text-text-primary font-heading text-title pt-2 border-t border-border">
          <span>Total Orden:</span>
          <span>${total.toLocaleString("es-CO")}</span>
        </div>
      </div>
    </div>
  );
}