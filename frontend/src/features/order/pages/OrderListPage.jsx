
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

                setPermissions({
                    create: false,
                    report: false,
                });
            } finally {
                setPermissionsLoaded(true);
            }
        };

        loadOrders();
        loadPermissions();
    }, []);

    return (
        <div className="p-6">
            <div
                className="
                    rounded-2xl
                    bg-panel/80
                    backdrop-blur-md
                    shadow-lg
                    p-6
                    border border-panel/40
                "
            >
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-text-primary">
                        Listado de órdenes
                    </h1>

                    <div className="flex items-center gap-3">
                        <div
                            className={`relative ${
                                !permissionsLoaded ||
                                !permissions.report ||
                                loading ||
                                orders.length === 0
                                    ? "cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <Button
                                variant="secondary"
                                onClick={() => setIsReportOpen(true)}
                                disabled={
                                    !permissionsLoaded ||
                                    !permissions.report ||
                                    loading ||
                                    orders.length === 0
                                }
                            >
                                Generar reporte
                            </Button>

                            {(
                                !permissionsLoaded ||
                                !permissions.report ||
                                loading ||
                                orders.length === 0
                            ) && (
                                <div className="absolute inset-0 cursor-not-allowed" />
                            )}
                        </div>

                        <div
                            className={`relative ${
                                !permissionsLoaded || !permissions.create
                                    ? "cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {permissions.create ? (
                                <Link to="/CreateOrder">
                                    <Button
                                        variant="primary"
                                        disabled={!permissionsLoaded}
                                    >
                                        Crear orden
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="primary" disabled>
                                    Crear orden
                                </Button>
                            )}

                            {(!permissionsLoaded || !permissions.create) && (
                                <div className="absolute inset-0 cursor-not-allowed" />
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center py-6 text-text-secondary">
                        Cargando órdenes...
                    </p>
                ) : error ? (
                    <p className="text-center py-6 text-error">
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
                title="órdenes"
                data={orders}
                fields={orderReportFields}
                filePrefix="orders"
            />
        </div>
    );
}
