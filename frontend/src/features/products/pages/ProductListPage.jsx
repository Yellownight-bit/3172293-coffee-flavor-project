
import { useEffect, useState } from "react";
import { DataTable, Button, ListReportModal } from "@/shared";
import { productColumns } from "../table/ProductColumns";
import { getAllProducts } from "../services/productServices";
import { Link } from "react-router-dom";
import { checkUserPermission } from "@/features/access/services/permissionService";

const productReportFields = [
    { key: "product_name", label: "Producto", default: true },
    { key: "product_price", label: "Precio", default: true },
    { key: "product_description", label: "Descripción", default: true },
    { key: "product_category", label: "Categoría", default: true },
];

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [permissions, setPermissions] = useState({
        create: false,
        report: false,
    });

    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                setError(error.message || "Error al cargar los productos");
            } finally {
                setLoading(false);
            }
        };

        const loadPermissions = async () => {
            try {
                const [canCreate, canReport] = await Promise.all([
                    checkUserPermission("create_product"),
                    checkUserPermission("report_product"),
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

        loadProducts();
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
                        Listado de Productos
                    </h1>

                    <div className="flex gap-4">

                        <div
                            className={`relative ${
                                !permissionsLoaded ||
                                !permissions.report ||
                                loading ||
                                products.length === 0
                                    ? "cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <Button
                                variant="secondary"
                                onClick={() => setIsReportOpen(true)}
                                disabled={
                                    loading ||
                                    products.length === 0 ||
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
                                products.length === 0
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
                                <Link to="/CreateProduct">
                                    <Button
                                        variant="primary"
                                        disabled={!permissionsLoaded}
                                    >
                                        Crear producto
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    variant="primary"
                                    disabled
                                >
                                    Crear producto
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
                        Cargando productos...
                    </p>
                ) : error ? (
                    <p className="text-center py-6 text-error">
                        {error}
                    </p>
                ) : (
                    <DataTable
                        data={products}
                        columns={productColumns}
                    />
                )}
            </div>

            <ListReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                title="productos"
                data={products}
                fields={productReportFields}
                filePrefix="products"
            />
        </div>
    );
}
