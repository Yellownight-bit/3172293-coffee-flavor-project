
import { Pencil, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import Swal from "sweetalert2";
import {
    showConfirmDeleteAlert,
    showCancelDeleteAlert,
    showSuccessAlert,
} from "@/shared/services/alertService";
import { checkUserPermission } from "@/features/access/services/permissionService";

export default function OrderRowActions({ order }) {
    const navigate = useNavigate();

    const [permissions, setPermissions] = useState({
        update: false,
        delete: false,
    });

    useEffect(() => {
        const loadPermissions = async () => {
            try {
                const [canUpdate, canDelete] = await Promise.all([
                    checkUserPermission("update_order"),
                    checkUserPermission("delete_order"),
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
        navigate(`/UpdateOrder/${order.id}`);
    };

    const handleDelete = async () => {
        const result = await showConfirmDeleteAlert({
            title: "¿Eliminar orden?",
            text: `¿Estás seguro de eliminar la orden ${order.id}?`,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        });

        if (result.isConfirmed) {
            console.log("Eliminar orden", order.id);

            await showSuccessAlert({
                title: "Orden eliminada",
                text: "La orden se eliminó correctamente.",
                confirmButtonText: "Aceptar",
                timer: 3000,
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            await showCancelDeleteAlert({
                title: "Eliminación cancelada",
                text: "La orden no fue eliminada.",
                confirmButtonText: "Aceptar",
                timer: 3000,
            });
        }
    };

    const handleView = () => {
        navigate(`/dashboard/orderRead/${order.id}`);
    };

    return (
        <div className="flex items-center gap-2">
            <div className={!permissions.update ? "relative cursor-not-allowed" : ""}>
                <Button
                    type="button"
                    variant="icon"
                    onClick={handleEdit}
                    title="Actualizar orden"
                    disabled={!permissions.update}
                >
                    <Pencil size={16} />
                </Button>

                {!permissions.update && (
                    <div className="absolute inset-0 cursor-not-allowed" />
                )}
            </div>

            <div className={!permissions.delete ? "relative cursor-not-allowed" : ""}>
                <Button
                    type="button"
                    variant="icon"
                    onClick={handleDelete}
                    title="Eliminar orden"
                    disabled={!permissions.delete}
                >
                    <Trash2 size={16} />
                </Button>

                {!permissions.delete && (
                    <div className="absolute inset-0 cursor-not-allowed" />
                )}
            </div>

            <Button
                type="button"
                variant="icon"
                onClick={handleView}
                title="Ver orden"
            >
                <Eye size={16} />
            </Button>
        </div>
    );
}
