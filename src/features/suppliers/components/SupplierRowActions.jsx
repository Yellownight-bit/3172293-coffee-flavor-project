// src/features/suppliers/components/SupplierRowActions.jsx

// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";

// Hook de React Router para navegar programáticamente
import { useNavigate } from "react-router-dom";

// Componente que renderiza las acciones de cada fila de proveedores
// Recibe como prop el objeto supplier
export default function SupplierRowActions({ supplier }) {

  // Hook que permite navegar entre rutas
  const navigate = useNavigate();

  // Acción para editar el proveedor
  const handleEdit = () => {
    navigate(`/suppliers/${supplier.id}/edit`);
  };

  // Acción para eliminar el proveedor
  const handleDelete = () => {
    console.log("Eliminar proveedor", supplier.id);
  };

  // Acción para ver el proveedor
  const handleView = () => {

    // Yupi S.A.S.
    if (supplier.id === 800123456) {
      navigate("/dashboard/readSupplier2");
    }

    // Nestlé Colombia
    else if (supplier.id === 860002130) {
      navigate("/dashboard/readSupplier");
    }

    // Alpina Productos Alimenticios
    else if (supplier.id === 860025900) {
      navigate("/dashboard/readSupplier3");
    }

    // Postobón S.A.
    else if (supplier.id === 860002503) {
      navigate("/dashboard/readSupplier1");
    }

    // Colombina S.A.
    else if (supplier.id === 890300186) {
      navigate("/dashboard/readSupplier4");
    }

  };

  return (
    // Contenedor de los botones de acciones
    <div className="flex gap-2">

      {/* Botón editar */}
      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Pencil size={16} />
      </button>

      {/* Botón eliminar */}
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Trash2 size={16} />
      </button>

      {/* Botón ver */}
      <button
        onClick={handleView}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Eye size={16} />
      </button>

    </div>
  );
}