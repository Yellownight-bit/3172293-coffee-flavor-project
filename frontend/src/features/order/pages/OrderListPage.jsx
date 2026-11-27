import { useEffect, useState } from "react";
import { DataTable, Button, ListReportModal } from "@/shared";
import { orderColumns } from "../table/OrderColumns";
import { Link } from "react-router-dom";
import { getAllOrders } from "../services/orderServices.js";
import { checkUserPermission } from "@/features/access/services/permissionService";

const orderReportFields = [
    { key: "id", label: "ID", default: true },
    { key: "table_number", label: "Mesa", default: true },
    { key: "waiter_id", label: "Mesero", default: true },
    { key: "dishes", label: "Productos", default: true },
    { key: "total", label: "Valor total", default: true },
    { key: "status", label: "Estado", default: true },
    { key: "created_at", label: "Fecha", default: true },
];

// Convierte una fecha a "YYYY-MM-DD" usando la hora LOCAL (no UTC)
const toLocalDateKey = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const CalendarIcon = ({ className = "h-5 w-5" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export default function OrderListPage() {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [permissions, setPermissions] = useState({
        create: false,
        report: false,
    });

    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    const todayKey = toLocalDateKey(new Date());
    const [selectedDate, setSelectedDate] = useState(todayKey);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (error) {
                console.error("Error al cargar las órdenes:", error);
                setError(error.message || "Error al cargar las órdenes");
            } finally {
                setLoading(false);
            }
        };

        const loadPermissions = async () => {
            try {
                const [canCreate, canReport] = await Promise.all([
                    checkUserPermission("create_order"),
                    checkUserPermission("report_order"),
                ]);

                setPermissions({
                    create: canCreate,
                    report: canReport,
                });
            } catch (error) {
                console.error("Error al verificar permisos:", error);
                setPermissions({ create: false, report: false });
            } finally {
                setPermissionsLoaded(true);
            }
        };

        loadOrders();
        loadPermissions();
    }, []);

    const filteredOrders = showAll
        ? orders
        : orders.filter(
              (order) => toLocalDateKey(order.created_at) === selectedDate
          );

    const totalSales = filteredOrders.reduce((total, order) => {
        const status = String(order.status || "").trim().toLowerCase();

        if (status === "pagada" || status === "pagado") {
            return total + Number(order.total || 0);
        }

        return total;
    }, 0);

    const formattedTotalSales = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(totalSales);

    const filterLabel = showAll
        ? "todas las fechas"
        : selectedDate === todayKey
        ? "hoy"
        : selectedDate;

    return (
        <div className="p-6">
            <div className="rounded-2xl bg-panel/80 backdrop-blur-md shadow-lg p-6 border border-panel/40">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-text-primary">
                        Listado de órdenes
                    </h1>

                    <div className="flex items-center gap-3">
                        {permissionsLoaded && permissions.report && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsReportOpen(true)}
                            >
                                Generar reporte
                            </Button>
                        )}

                        {permissionsLoaded && permissions.create && (
                            <Link to="/CreateOrder">
                                <Button type="button">
                                    Crear orden
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Filtros por fecha */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <label
                        className={`flex items-center gap-2 rounded-xl border border-border bg-panel-muted px-3 py-2 text-sm text-text-secondary ${
                            showAll ? "opacity-50" : ""
                        }`}
                    >
                        <CalendarIcon className="h-5 w-5 text-brand-strong" />
                        <input
                            type="date"
                            value={selectedDate}
                            max={todayKey}
                            disabled={showAll}
                            onChange={(e) =>
                                setSelectedDate(e.target.value || todayKey)
                            }
                            className="bg-transparent text-text-primary outline-none"
                        />
                    </label>

                    <Button
                        type="button"
                        variant={showAll ? "primary" : "secondary"}
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll ? "Ver solo por fecha" : "Mostrar todo"}
                    </Button>

                    {!showAll && selectedDate !== todayKey && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setSelectedDate(todayKey)}
                        >
                            Hoy
                        </Button>
                    )}
                </div>

                <div className="mb-6 rounded-2xl border border-border bg-panel-muted p-5">
                    <p className="text-sm font-medium text-text-secondary">
                        Total de ventas
                    </p>

                    <p className="mt-2 text-3xl font-bold text-brand-strong">
                        {formattedTotalSales}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                        Calculado con las órdenes pagadas ({filterLabel}).
                    </p>
                </div>

                {loading ? (
                    <p className="text-text-secondary">
                        Cargando órdenes...
                    </p>
                ) : error ? (
                    <p className="text-red-500">
                        {error}
                    </p>
                ) : (
                    <DataTable
                        data={filteredOrders}
                        columns={orderColumns}
                    />
                )}
            </div>

            <ListReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                data={filteredOrders}
                fields={orderReportFields}
                title="Reporte de órdenes"
                fileName="reporte_ordenes"
            />
        </div>
    );
}