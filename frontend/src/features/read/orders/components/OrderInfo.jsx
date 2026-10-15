import orderLogo from "@/assets/images/capucchino.png"; 
export default function OrderInfo({ order }) {
  return (
    <div className="bg-surface rounded-2xl p-6 space-y-4 text-medium border border-border bg-white">
      {/* Imagen / Logo de la orden */}
      <div className="flex justify-center pb-2 border-b border-border">
        <img
          src={orderLogo}
          alt="Logo de la Orden"
          className="w-24 h-24 object-contain rounded-xl bg-white p-2 shadow-sm"
        />
      </div>

      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="font-heading text-text-primary">Mesa asociada:</span>
        <span className="font-heading text-text-primary">{order.tableNumber}</span>
      </div>

      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="font-heading text-text-primary">Mesero responsable:</span>
        <span className="text-text-primary">{order.waiter}</span>
      </div>

      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="font-heading text-text-primary">Fecha y Hora:</span>
        <span className="text-text-primary">{order.createdAt}</span>
      </div>

      <div className="flex justify-between items-center pt-1">
        <span className="font-heading text-text-primary">Estado actual:</span>
        <span className="bg-brand text-text-inverse text-small font-heading px-3 py-1 rounded-full uppercase tracking-wider">
          {order.status}
        </span>
      </div>
    </div>
  );
}