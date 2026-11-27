import { Armchair, CheckCircle2, LockKeyhole } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Plano de mesas                                                      */
/* ------------------------------------------------------------------ */

// Área de dibujo de cada mesa (todas iguales para que alineen en la grilla)
const STAGE = { w: 104, h: 72 };

// Medidas de las sillas en px
const CHAIR = { length: 14, thickness: 8, gap: 3 };

// Formas de mesa. "chairs" = cantidad de sillas por cada lado.
const TABLE_VARIANTS = [
    { id: "round-4", seats: 4, shape: "round", w: 44, h: 44, chairs: { top: 1, bottom: 1, left: 1, right: 1 } },
    { id: "rect-4", seats: 4, shape: "rect", w: 56, h: 40, chairs: { top: 2, bottom: 2 } },
    { id: "square-4", seats: 4, shape: "square", w: 44, h: 44, chairs: { top: 1, bottom: 1, left: 1, right: 1 } },
    { id: "rect-6", seats: 6, shape: "rect", w: 76, h: 40, chairs: { top: 2, bottom: 2, left: 1, right: 1 } },
    { id: "round-2", seats: 2, shape: "round", w: 40, h: 40, chairs: { top: 1, bottom: 1 } },
    { id: "round-6", seats: 6, shape: "round", w: 48, h: 48, chairs: { top: 2, bottom: 2, left: 1, right: 1 } },
];

// Si la mesa trae capacidad (capacity / seats / capacidad) se usa esa;
// si no, la forma se reparte según el número de mesa (siempre la misma por mesa).
const getVariant = (table, index) => {
    const seats = Number(table.capacity ?? table.seats ?? table.capacidad);
    const matching = seats
        ? TABLE_VARIANTS.filter((variant) => variant.seats === seats)
        : [];
    const pool = matching.length > 0 ? matching : TABLE_VARIANTS;

    const numericValue = Number(table.value);
    const key = Number.isFinite(numericValue) ? numericValue : index;

    return pool[Math.abs(key) % pool.length];
};

// Calcula la posición de la mesa y de sus sillas dentro del área de dibujo
const getLayout = (variant) => {
    const { w, h, chairs } = variant;
    const { length, thickness, gap } = CHAIR;

    const left = (STAGE.w - w) / 2;
    const top = (STAGE.h - h) / 2;

    const items = [];

    const horizontal = (side, count, y) => {
        for (let i = 1; i <= count; i += 1) {
            const cx = left + (w * i) / (count + 1);
            items.push({
                key: `${side}-${i}`,
                left: cx - length / 2,
                top: y,
                width: length,
                height: thickness,
            });
        }
    };

    const vertical = (side, count, x) => {
        for (let i = 1; i <= count; i += 1) {
            const cy = top + (h * i) / (count + 1);
            items.push({
                key: `${side}-${i}`,
                left: x,
                top: cy - length / 2,
                width: thickness,
                height: length,
            });
        }
    };

    horizontal("top", chairs.top || 0, top - gap - thickness);
    horizontal("bottom", chairs.bottom || 0, top + h + gap);
    vertical("left", chairs.left || 0, left - gap - thickness);
    vertical("right", chairs.right || 0, left + w + gap);

    return { body: { left, top, width: w, height: h }, chairs: items };
};

/* ------------------------------------------------------------------ */
/* Estilos por estado                                                  */
/* ------------------------------------------------------------------ */

const STATE_STYLES = {
    available: {
        card: "border-border bg-surface hover:border-brand-strong hover:bg-brand-subtle",
        body: "border-success bg-surface text-text-primary",
        chair: "border-success bg-success/30",
        status: "text-success",
        detail: "text-text-secondary",
    },
    selected: {
        card: "border-brand-strong bg-brand-subtle ring-2 ring-brand-strong/20",
        body: "border-brand-strong bg-brand-strong text-white",
        chair: "border-brand-strong bg-brand-strong",
        status: "text-brand-strong",
        detail: "text-brand-strong",
    },
    // Ocupada: fondo error-soft y texto/ícono error (sin opacidades)
    occupied: {
        card: "border-error bg-error-soft cursor-not-allowed",
        body: "border-error bg-error-soft text-error",
        chair: "border-error bg-error",
        status: "text-error",
        detail: "text-error",
    },
};

/* ------------------------------------------------------------------ */
/* Dibujo de una mesa con sus sillas                                   */
/* ------------------------------------------------------------------ */

function TableGraphic({ variant, state, number }) {
    const styles = STATE_STYLES[state];
    const { body, chairs } = getLayout(variant);

    const bodyRadius = variant.shape === "round" ? "rounded-full" : "rounded-lg";

    return (
        <div
            className="relative mx-auto shrink-0"
            style={{ width: STAGE.w, height: STAGE.h }}
            aria-hidden="true"
        >
            {chairs.map((chair) => (
                <span
                    key={chair.key}
                    className={`absolute rounded border ${styles.chair}`}
                    style={{
                        left: chair.left,
                        top: chair.top,
                        width: chair.width,
                        height: chair.height,
                    }}
                />
            ))}

            <div
                className={`absolute flex items-center justify-center border-2 text-sm font-bold ${bodyRadius} ${styles.body}`}
                style={{
                    left: body.left,
                    top: body.top,
                    width: body.width,
                    height: body.height,
                }}
            >
                {number}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

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

            {/* Salón */}
            <div className="rounded-2xl border border-dashed border-border-soft bg-surface/40 p-3 sm:p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {tables.map((table, index) => {
                        const openOrder = getOpenOrder(table.value);

                        const isCurrentOrder =
                            openOrder &&
                            currentOrderId !== null &&
                            Number(openOrder.id) === Number(currentOrderId);

                        const isOccupied = Boolean(openOrder) && !isCurrentOrder;
                        const isSelected = String(value) === String(table.value);

                        const state = isSelected
                            ? "selected"
                            : isOccupied
                              ? "occupied"
                              : "available";

                        const styles = STATE_STYLES[state];
                        const variant = getVariant(table, index);

                        const statusLabel =
                            state === "selected"
                                ? "Seleccionada"
                                : state === "occupied"
                                  ? "Ocupada"
                                  : "Disponible";

                        const StatusIcon =
                            state === "selected"
                                ? CheckCircle2
                                : state === "occupied"
                                  ? LockKeyhole
                                  : Armchair;

                        const detail = isOccupied
                            ? `#${openOrder.id} · ${getWaiterName(openOrder.waiter_id)}`
                            : isCurrentOrder
                              ? `Orden #${openOrder.id} · Mesa actual`
                              : "";

                        return (
                            <button
                                key={table.value}
                                type="button"
                                disabled={isOccupied}
                                aria-pressed={isSelected}
                                aria-label={`${table.label}: ${statusLabel}`}
                                title={table.label}
                                onClick={() => onChange(String(table.value))}
                                className={`flex min-w-0 flex-col items-center gap-1 rounded-xl border-2 p-2 text-center transition-colors duration-200 disabled:cursor-not-allowed ${styles.card}`}
                            >
                                <TableGraphic
                                    variant={variant}
                                    state={state}
                                    number={table.value}
                                />

                                <span
                                    className={`flex items-center justify-center gap-1 text-xs font-semibold ${styles.status}`}
                                >
                                    <StatusIcon size={12} aria-hidden="true" />
                                    {statusLabel}
                                </span>

                                <span
                                    className={`block min-h-4 w-full truncate text-[11px] leading-4 ${styles.detail}`}
                                >
                                    {detail || "\u00A0"}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 flex justify-center">
                    <span className="rounded-full border border-border bg-surface px-4 py-1 text-xs text-text-secondary">
                        Entrada
                    </span>
                </div>
            </div>

            {error && (
                <p className="text-error text-sm mt-3">
                    {error}
                </p>
            )}
        </div>
    );
}