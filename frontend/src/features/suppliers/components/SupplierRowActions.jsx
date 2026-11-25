
import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  showConfirmDeleteAlert,
  showCancelDeleteAlert,
  showSuccessAlert,
} from "@/shared/services/alertService";
import { checkUserPermission } from "@/features/access/services/permissionService";

export default function SupplierRowActions({ supplier }) {
  const navigate = useNavigate();

  const [canUpdateSupplier, setCanUpdateSupplier] = useState(false);
  const [canDeleteSupplier, setCanDeleteSupplier] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const [canUpdate, canDelete] = await Promise.all([
          checkUserPermission("update_supplier"),
          checkUserPermission("delete_supplier"),
        ]);

        setCanUpdateSupplier(canUpdate);
        setCanDeleteSupplier(canDelete);
      } catch (error) {
        console.error("Error al verificar los permisos:", error);
        setCanUpdateSupplier(false);
        setCanDeleteSupplier(false);
      }
    };

    loadPermissions();
  }, []);

  const handleEdit = () => {
    navigate(`/UpdateSupplier/${supplier.id}`);
  };

  const handleDelete = async () => {
    const result = await showConfirmDeleteAlert({
      title: "¿Eliminar proveedor?",
      text: `¿Estás seguro de eliminar el proveedor ${supplier.supplier_name}?`,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
    });

    if (result.isConfirmed) {
      console.log("Eliminar proveedor", supplier.id);

      await showSuccessAlert({
        title: "Proveedor eliminado",
        text: "El proveedor se eliminó correctamente.",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await showCancelDeleteAlert({
        title: "Eliminación cancelada",
        text: "El proveedor no fue eliminado.",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    }
  };

  const handleView = () => {
    navigate(`/dashboard/supplierRead/${supplier.id}`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleEdit}
        disabled={!canUpdateSupplier}
        title={
          !canUpdateSupplier
            ? "No tienes permiso para actualizar proveedores"
            : "Editar proveedor"
        }
        className={`p-1 rounded hover:bg-panel-muted ${
          !canUpdateSupplier
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={handleDelete}
        disabled={!canDeleteSupplier}
        title={
          !canDeleteSupplier
            ? "No tienes permiso para eliminar proveedores"
            : "Eliminar proveedor"
        }
        className={`p-1 rounded hover:bg-panel-muted ${
          !canDeleteSupplier
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        <Trash2 size={16} />
      </button>

      <button
        onClick={handleView}
        title="Ver proveedor"
        className="p-1 rounded hover:bg-panel-muted cursor-pointer"
      >
        <Eye size={16} />
      </button>
    </div>
  );
}
