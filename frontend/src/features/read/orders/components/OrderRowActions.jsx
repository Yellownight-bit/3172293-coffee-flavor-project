// src/features/orders/components/OrderRowActions.jsx

// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";

// Hook de React Router para navegar programáticamente
import { useNavigate } from "react-router-dom";

// Componente de botón reutilizable del proyecto
import { Button } from "@/shared";

// Componente que renderiza las acciones de cada fila de órdenes
// Recibe como prop el objeto order
export default function OrderRowActions({ order }) {

  // Hook que permite navegar entre rutas
  const navigate = useNavigate();

  // Acción para editar la orden
  const handleEdit = () => {
    navigate(`/UpdateOrder`);
  };

  // Acción para eliminar la orden
  const handleDelete = () => {
    console.log("Eliminar orden", order.id);
  };

  // Acción para ver la orden detallada
  const handleView = () => {

    // Orden 1 (Mesa 05)
    if (order.id === 1) {
      navigate("/dashboard/ReadOrder");
    }

    // Orden 2
    else if (order.id === "ORD-00002" || order.id === 2) {
      navigate("/dashboard/ReadOrder2");
    }

    // Orden 3
    else if (order.id === "ORD-00003" || order.id === 3) {
      navigate("/dashboard/ReadOrder3");
    }

    // Ruta por defecto si no coincide
    else {
      navigate("/dashboard/ReadOrder");
    }

  };

  return (
    // Contenedor de los botones de acciones
    <div className="flex gap-2">

      {/* Botón editar */}
      <Button
        type="button"
        variant="icon"
        onClick={handleEdit}
        title="Editar orden"
      >
        <Pencil size={16} />
      </Button>

      {/* Botón eliminar */}
      <Button
        type="button"
        variant="icon"
        onClick={handleDelete}
        title="Eliminar orden"
      >
        <Trash2 size={16} />
      </Button>

      {/* Botón ver */}
      <Button
        type="button"
        variant="icon"
        onClick={handleView}
        title="Visualizar orden"
      >
        <Eye size={16} />
      </Button>

    </div>
  );
}