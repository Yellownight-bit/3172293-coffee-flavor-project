
import { useEffect, useState } from "react";
import { DataTable, Button, ListReportModal } from "@/shared";
import { inventoryColumns } from "../table/InventoryColumns";
import { getAllInventory } from "../services/inventoryServices";
import { Link } from "react-router-dom";
import { checkUserPermission } from "@/features/access/services/permissionService";

const inventoryReportFields = [
    { key: "product_name", label: "Producto", default: true },
    { key: "product_id", label: "ID del producto", default: true },
    { key: "product_quantity", label: "Stock actual", default: true },
    { key: "product_price", label: "Precio", default: true },
    { key: "product_supplier_names", label: "Proveedor", default: true },
    { key: "product_entry_date", label: "Fecha de ingreso", default: true },
];

export default function InventoryListPage() {
    const [inventory, setInventory] = useState([]);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [permissions, setPermissions] = useState({
        create: false,
        report: false,
    });

    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    useEffect(() => {
        const loadInventory = async () => {
            try {
                const data = await getAllInventory();
                setInventory(data);
            } catch (error) {
                console.error("Error al cargar el inventario:", error);
                setError(error.message || "Error al cargar el inventario");
            } finally {
                setLoading(false);
            }
        };

        const loadPermissions = async () => {
            try {
                const [canCreate, canReport] = await Promise.all([
                    checkUserPermission("create_inventory"),
                    checkUserPermission("report_inventory"),
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

        loadInventory();
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
                        Listado de inventario
                    </h1>

                    <div className="flex gap-4">
                        <div
                            className={`relative ${
                                !permissionsLoaded ||
                                !permissions.report ||
                                loading ||
                                inventory.length === 0
                                    ? "cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <Button
                                variant="secondary"
                                onClick={() => setIsReportOpen(true)}
                                disabled={
                                    loading ||
                                    inventory.length === 0 ||
                                    !permissionsLoaded ||
                                    !permissions.report
                                }
                            >
                                Generar reporte
                            </Button>

                            {(
                                !permissionsLoaded ||
                                !permissions.report ||
                                loading ||
                                inventory.length === 0
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
                                <Link to="/Createinventory">
                                    <Button
                                        variant="primary"
                                        disabled={!permissionsLoaded}
                                    >
                                        Agregar producto
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="primary" disabled>
                                    Agregar producto
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
                        Cargando inventario...
                    </p>
                ) : error ? (
                    <p className="text-center py-6 text-error">
                        {error}
                    </p>
                ) : (
                    <DataTable
                        data={inventory}
                        columns={inventoryColumns}
                    />
                )}
            </div>

            <ListReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                title="inventario"
                data={inventory}
                fields={inventoryReportFields}
                filePrefix="inventory"
            />
        </div>
    );
}
