// src/features/order/components/OrderRowActions.jsx

import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";

export default function OrderRowActions({ order }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/UpdateOrder");
  };

  const handleDelete = () => {
    console.log("Eliminar orden", order?.id);
  };

  const handleView = () => {
    // Si la orden tiene ID de ejemplo
    if (order?.id === "ORD-00001" || order?.id === 1) {
      navigate("/dashboard/ReadOrder");
    } else if (order?.id === "ORD-00002" || order?.id === 2) {
      navigate("/dashboard/ReadOrder2");
    } else if (order?.id === "ORD-00003" || order?.id === 3) {
      navigate("/dashboard/ReadOrder3");
    } else {
      navigate("/dashboard/ReadOrder");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="icon"
        onClick={handleEdit}
        title="Actualizar orden"
      >
        <Pencil size={16} />
      </Button>

      <Button
        type="button"
        variant="icon"
        onClick={handleDelete}
        title="Eliminar orden"
      >
        <Trash2 size={16} />
      </Button>

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