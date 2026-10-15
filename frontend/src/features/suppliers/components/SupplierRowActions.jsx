import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  showConfirmDeleteAlert,
  showCancelDeleteAlert,
  showSuccessAlert,
} from "@/shared/services/alertService";

export default function SupplierRowActions({ supplier }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/UpdateSupplier`);
  };

  const handleDelete = async () => {
    const result = await showConfirmDeleteAlert({
      title: "¿Eliminar proveedor?",
      text: `¿Estás seguro de eliminar el proveedor ${supplier.companyName}?`,
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
    if (supplier.id === 800123456) {
      navigate("/dashboard/readSupplier2");
    } else if (supplier.id === 860002130) {
      navigate("/dashboard/readSupplier");
    } else if (supplier.id === 860025900) {
      navigate("/dashboard/readSupplier3");
    } else if (supplier.id === 860002503) {
      navigate("/dashboard/readSupplier1");
    } else if (supplier.id === 890300186) {
      navigate("/dashboard/readSupplier4");
    }
  };

  return (
    <div className="flex gap-2">

      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Trash2 size={16} />
      </button>

      <button
        onClick={handleView}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Eye size={16} />
      </button>

    </div>
  );
}
