
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

export default function ProductRowActions({ product }) {
  const navigate = useNavigate();

  const [canUpdateProduct, setCanUpdateProduct] = useState(false);
  const [canDeleteProduct, setCanDeleteProduct] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const [canUpdate, canDelete] = await Promise.all([
          checkUserPermission("update_product"),
          checkUserPermission("delete_product"),
        ]);

        setCanUpdateProduct(canUpdate);
        setCanDeleteProduct(canDelete);
      } catch (error) {
        console.error("Error al verificar permisos:", error);
        setCanUpdateProduct(false);
        setCanDeleteProduct(false);
      }
    };

    loadPermissions();
  }, []);

  const handleEdit = () => {
    navigate(`/UpdateProduct/${product.id}`);
  };

  const handleDelete = async () => {
    const result = await showConfirmDeleteAlert({
      title: "¿Eliminar producto?",
      text: `¿Estás seguro de eliminar el producto ${product.product_name}?`,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
    });

    if (result.isConfirmed) {
      console.log("Eliminar producto", product.id);

      await showSuccessAlert({
        title: "Producto eliminado",
        text: "El producto se eliminó correctamente.",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await showCancelDeleteAlert({
        title: "Eliminación cancelada",
        text: "El producto no fue eliminado.",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });
    }
  };

  const handleView = () => {
    navigate(`/dashboard/productRead/${product.id}`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleEdit}
        disabled={!canUpdateProduct}
        title={
          !canUpdateProduct
            ? "No tienes permiso para editar productos"
            : "Editar producto"
        }
        className={`p-1 rounded hover:bg-panel-muted ${
          !canUpdateProduct
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={handleDelete}
        disabled={!canDeleteProduct}
        title={
          !canDeleteProduct
            ? "No tienes permiso para eliminar productos"
            : "Eliminar producto"
        }
        className={`p-1 rounded hover:bg-panel-muted ${
          !canDeleteProduct
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        <Trash2 size={16} />
      </button>

      <button
        onClick={handleView}
        className="p-1 rounded hover:bg-panel-muted"
        title="Visualizar producto"
      >
        <Eye size={16} />
      </button>
    </div>
  );
}
