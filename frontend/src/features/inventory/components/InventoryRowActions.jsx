
import { Pencil, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    showConfirmDeleteAlert,
    showCancelDeleteAlert,
    showSuccessAlert,
} from "@/shared/services/alertService";
import { checkUserPermission } from "@/features/access/services/permissionService";

export default function InventoryRowActions({ item }) {
    const navigate = useNavigate();

    const [permissions, setPermissions] = useState({
        update: false,
        delete: false,
    });

    useEffect(() => {
        const loadPermissions = async () => {
            try {
                const [canUpdate, canDelete] = await Promise.all([
                    checkUserPermission("update_inventory"),
                    checkUserPermission("delete_inventory"),
                ]);

                setPermissions({
                    update: canUpdate,
                    delete: canDelete,
                });
            } catch (error) {
                console.error("Error al verificar permisos:", error);
                setPermissions({
                    update: false,
                    delete: false,
                });
            }
        };

        loadPermissions();
    }, []);

    const handleEdit = () => {
        navigate(`/UpdateInventory/${item.id}`);
    };

    const handleRead = () => {
        navigate(`/dashboard/inventoryRead/${item.id}`);
    };

    const handleDelete = async () => {
        const result = await showConfirmDeleteAlert({
            title: "¿Eliminar registro?",
            text: `¿Estás seguro de eliminar el registro de inventario ${item.id}?`,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        });

        if (result.isConfirmed) {
            console.log("Eliminar registro de inventario", item.id);

            await showSuccessAlert({
                title: "Registro eliminado",
                text: "El registro de inventario se eliminó correctamente.",
                confirmButtonText: "Aceptar",
                timer: 3000,
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            await showCancelDeleteAlert({
                title: "Eliminación cancelada",
                text: "El registro de inventario no fue eliminado.",
                confirmButtonText: "Aceptar",
                timer: 3000,
            });
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleRead}
                className="p-1 rounded hover:bg-panel-muted"
            >
                <Eye size={16} />
            </button>

            <div className={!permissions.update ? "relative cursor-not-allowed" : ""}>
                <button
                    onClick={handleEdit}
                    disabled={!permissions.update}
                    className={`btn btn-primary ${
                        !permissions.update ? "cursor-not-allowed" : ""
                    }`}
                >
                    <Pencil size={16} />
                </button>

                {!permissions.update && (
                    <div className="absolute inset-0 cursor-not-allowed" />
                )}
            </div>

            <div className={!permissions.delete ? "relative cursor-not-allowed" : ""}>
                <button
                    onClick={handleDelete}
                    disabled={!permissions.delete}
                    className={`p-1 rounded hover:bg-panel-muted ${
                        !permissions.delete ? "cursor-not-allowed" : ""
                    }`}
                >
                    <Trash2 size={16} />
                </button>

                {!permissions.delete && (
                    <div className="absolute inset-0 cursor-not-allowed" />
                )}
            </div>
        </div>
    );
}
