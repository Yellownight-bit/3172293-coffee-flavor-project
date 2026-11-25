
import { useEffect, useState } from "react";
import { Button, DetailItem, StatusSwitch } from "@/shared";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAllSuppliers,
    updateSupplierStatus,
} from "../services/supplierServices.js";
import { checkUserPermission } from "@/features/access/services/permissionService";
import { API_URL } from "@/features/config";

export default function ReadSupplier() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [canDisableSupplier, setCanDisableSupplier] = useState(false);
    const [canUpdateSupplier, setCanUpdateSupplier] = useState(false);

    const getImageUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("http")) return image;

        const serverUrl = API_URL.replace(/\/api\/?$/, "");

        return `${serverUrl}${image.startsWith("/") ? image : `/${image}`}`;
    };

    useEffect(() => {

        const loadSupplier = async () => {
            try {
                setLoading(true);

                try {
                    const [canDisable, canUpdate] = await Promise.all([
                        checkUserPermission("disable_supplier"),
                        checkUserPermission("update_supplier"),
                    ]);

                    setCanDisableSupplier(canDisable);
                    setCanUpdateSupplier(canUpdate);
                } catch (error) {
                    console.error("Error al verificar los permisos:", error);
                    setCanDisableSupplier(false);
                    setCanUpdateSupplier(false);
                }

                const suppliers = await getAllSuppliers();

                const supplierData = suppliers.find(
                    (supplier) => Number(supplier.id) === Number(id)
                );

                if (supplierData) {

                    let suppliedProducts = supplierData.supplied_products || [];

                    if (typeof suppliedProducts === "string") {
                        try {
                            suppliedProducts = JSON.parse(suppliedProducts);
                        } catch {
                            suppliedProducts = [];
                        }
                    }

                    if (!Array.isArray(suppliedProducts)) {
                        suppliedProducts = [];
                    }

                    setSupplier({
                        id: supplierData.id,
                        companyName: supplierData.supplier_name,
                        documentType: supplierData.supplier_document_type,
                        documentNumber: supplierData.supplier_document_number,
                        supplierEmail: supplierData.supplier_email,
                        supplierPhone: supplierData.supplier_phone,
                        supplierAddress: supplierData.supplier_address,
                        supplierImage: supplierData.supplier_image || null,
                        productTypes: suppliedProducts,
                        status: supplierData.is_active,
                    });

                } else {
                    setSupplier(null);
                }

            } catch (error) {
                console.error("Error al cargar el proveedor:", error);
                setSupplier(null);
            } finally {
                setLoading(false);
            }
        };

        loadSupplier();

    }, [id]);

    const handleStatusChange = async (value) => {
        try {
            await updateSupplierStatus(supplier.id, value);

            setSupplier((currentSupplier) => ({
                ...currentSupplier,
                status: value,
            }));

        } catch (error) {
            console.error("Error al cambiar el estado del proveedor:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-text-primary">
                Cargando información del proveedor...
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4 text-text-primary">
                <p>No se encontró el proveedor con ID {id}.</p>

                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate("/dashboard/supplierList")}
                >
                    ← Atrás
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-panel/80 backdrop-blur-md shadow-lg">

            <div className="flex-1 p-6 flex justify-center items-center">

                <div className="w-full max-w-6xl rounded-3xl shadow-lg p-8 relative text-text-primary border-2 border-border">

                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate("/dashboard/supplierList")}
                    >
                        ← Atrás
                    </Button>

                    <div className="flex items-center gap-3 mb-8 mt-8 border-b border-border-strong pb-3">

                        <div className="text-4xl">
                            🏢
                        </div>

                        <h2 className="text-2xl font-bold uppercase text-text-primary">
                            Perfil de Proveedor
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-2 gap-10">

                        <div className="flex flex-col items-center">

                            <div className="w-64 h-72 rounded-xl overflow-hidden border-4 border-panel shadow-md flex items-center justify-center bg-surface">

                                {supplier.supplierImage ? (
                                    <img
                                        src={getImageUrl(supplier.supplierImage)}
                                        alt={`Imagen de ${supplier.companyName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-7xl font-bold text-text-secondary uppercase">
                                        {supplier.companyName?.trim().slice(0, 2)}
                                    </span>
                                )}

                            </div>

                            <h3 className="mt-5 text-xl font-bold text-text-primary">
                                {supplier.companyName}
                            </h3>

                            <div className="w-full border-b border-border-strong my-5" />

                            <div className="flex items-center gap-3">

                                <span className="font-semibold text-text-primary">
                                    Estado
                                </span>

                                <StatusSwitch
                                    checked={supplier.status}
                                    onChange={handleStatusChange}
                                    disabled={!canDisableSupplier}
                                />

                            </div>

                            <div className="flex justify-center mt-8">

                                <div className={`relative ${!canUpdateSupplier ? "cursor-not-allowed" : ""}`}>

                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => navigate(`/UpdateSupplier/${supplier.id}`)}
                                        disabled={!canUpdateSupplier}
                                    >
                                        Editar
                                    </Button>

                                    {!canUpdateSupplier && (
                                        <div className="absolute inset-0 cursor-not-allowed" />
                                    )}

                                </div>

                            </div>

                        </div>

                        <div className="flex flex-col gap-6">

                            <div className="bg-panel rounded-2xl shadow-md p-8 text-text-primary">

                                <DetailItem
                                    label="Tipo de documento"
                                    value={supplier.documentType}
                                />

                                <DetailItem
                                    label="Número de documento"
                                    value={supplier.documentNumber}
                                />

                                <DetailItem
                                    label="Nombre de la compañía"
                                    value={supplier.companyName}
                                />

                                <DetailItem
                                    label="Dirección"
                                    value={supplier.supplierAddress}
                                />

                                <DetailItem
                                    label="Teléfono"
                                    value={supplier.supplierPhone}
                                />

                                <DetailItem
                                    label="Correo electrónico"
                                    value={supplier.supplierEmail}
                                />

                            </div>

                            <div className="bg-panel rounded-2xl shadow-md p-6 text-text-primary">

                                <h3 className="text-center text-2xl font-medium mb-6">
                                    Productos que suministra
                                </h3>

                                <div className="flex justify-center gap-6 flex-wrap">

                                    {supplier.productTypes.length > 0 ? (
                                        supplier.productTypes.map((product, index) => (
                                            <span
                                                key={index}
                                                className="px-6 py-2 rounded-full bg-accent-soft border border-border-strong text-sm font-medium"
                                            >
                                                {typeof product === "string"
                                                    ? product
                                                    : product.productName || product.product_name || product.name || "Producto"}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-text-muted">
                                            No hay productos registrados.
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
