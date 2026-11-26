
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

    const totalSales = orders.reduce((total, order) => {
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

                <div className="mb-6 rounded-2xl border border-border bg-panel-muted p-5">
                    <p className="text-sm font-medium text-text-secondary">
                        Total de ventas
                    </p>

                    <p className="mt-2 text-3xl font-bold text-brand-strong">
                        {formattedTotalSales}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                        Calculado con las órdenes pagadas.
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
                        data={orders}
                        columns={orderColumns}
                    />
                )}
            </div>

            <ListReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                data={orders}
                fields={orderReportFields}
                title="Reporte de órdenes"
                fileName="reporte_ordenes"
            />
        </div>
    );
}
