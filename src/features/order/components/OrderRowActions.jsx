// src/features/order/components/OrderRowActions.jsx

// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";

// Hook de React Router para navegar programáticamente
import { useNavigate } from "react-router-dom";

// Componente que renderiza las acciones de cada fila de órdenes
// Recibe como prop el objeto order
export default function OrderRowActions({ order }) {

  // Hook que permite navegar entre rutas
  const navigate = useNavigate();

  // Acción para actualizar la orden
  const handleEdit = () => {
    navigate("/UpdateOrder");
  };

  // Acción para eliminar la orden
  const handleDelete = () => {
    console.log("Eliminar orden", order.id);
  };

  // Acción para ver la orden
  const handleView = () => {
    console.log("Ver orden", order.id);

    // Por ahora navegamos al ReadOrder
    navigate("/dashboard/readOrder");
  };

  return (
    // Contenedor de los botones de acciones
    <div className="flex items-center gap-2">

      {/* Botón editar */}
      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-gray-100"
        title="Actualizar orden"
      >
        <Pencil size={16} />
      </button>

      {/* Botón eliminar */}
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-gray-100"
        title="Eliminar orden"
      >
        <Trash2 size={16} />
      </button>

      {/* Botón ver */}
      <button
        onClick={handleView}
        className="p-1 rounded hover:bg-gray-100"
        title="Ver orden"
      >
        <Eye size={16} />
      </button>

    </div>
  );
}