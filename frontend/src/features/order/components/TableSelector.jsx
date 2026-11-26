
import { Armchair, CheckCircle2, LockKeyhole } from "lucide-react";

export default function TableSelector({
  tables = [],
  orders = [],
  users = [],
  value = "",
  onChange,
  error,
  currentOrderId = null,
}) {
  const getOpenOrder = (tableNumber) => {
    return orders.find(
      (order) =>
        Number(order.table_number) === Number(tableNumber) &&
        order.status?.toLowerCase().trim() === "abierta"
    );
  };

  const getWaiterName = (waiterId) => {
    const waiter = users.find(
      (user) => Number(user.value) === Number(waiterId)
    );

    return waiter?.label || "Mesero no disponible";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-text-secondary uppercase text-sm">
            Seleccionar mesa
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Selecciona una mesa disponible para la orden.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-success" />
            Disponible
          </span>

          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-error" />
            Ocupada
          </span>

          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-brand-strong" />
            Seleccionada
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {tables.map((table) => {
          const openOrder = getOpenOrder(table.value);

          const isCurrentOrder =
            openOrder &&
            currentOrderId !== null &&
            Number(openOrder.id) === Number(currentOrderId);

          const isOccupied = Boolean(openOrder) && !isCurrentOrder;
          const isSelected =
            String(value) === String(table.value);

          const isDisabled = isOccupied;

          return (
            <button
              key={table.value}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(String(table.value))}
              className={`
                relative flex flex-col items-center justify-center
                min-h-36 rounded-2xl border-2 p-4 text-center
                transition-all duration-200
                ${
                  isSelected
                    ? "border-brand-strong bg-brand-subtle ring-2 ring-brand-strong/20"
                    : isOccupied
                      ? "border-error/30 bg-error/5 cursor-not-allowed opacity-80"
                      : "border-border bg-surface hover:border-brand-strong hover:bg-brand-subtle"
                }
              `}
            >
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full mb-2
                  ${
                    isSelected
                      ? "bg-brand-strong text-white"
                      : isOccupied
                        ? "bg-error/10 text-error"
                        : "bg-success/10 text-success"
                  }
                `}
              >
                {isOccupied ? (
                  <LockKeyhole size={23} />
                ) : isSelected ? (
                  <CheckCircle2 size={25} />
                ) : (
                  <Armchair size={25} />
                )}
              </div>

              <span className="font-bold text-text-primary">
                {table.label}
              </span>

              {isOccupied ? (
                <div className="mt-2 space-y-1">
                  <span className="block text-xs font-bold text-error">
                    Orden #{openOrder.id}
                  </span>

                  <span className="block text-xs text-text-secondary line-clamp-2">
                    {getWaiterName(openOrder.waiter_id)}
                  </span>

                  <span className="block text-xs font-semibold text-error">
                    Ocupada
                  </span>
                </div>
              ) : isCurrentOrder ? (
                <div className="mt-2 space-y-1">
                  <span className="block text-xs font-bold text-brand-strong">
                    Orden #{openOrder.id}
                  </span>

                  <span className="block text-xs text-brand-strong">
                    Mesa actual
                  </span>
                </div>
              ) : (
                <span
                  className={`mt-2 text-xs font-semibold ${
                    isSelected
                      ? "text-brand-strong"
                      : "text-success"
                  }`}
                >
                  {isSelected ? "Seleccionada" : "Disponible"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-error text-sm mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
