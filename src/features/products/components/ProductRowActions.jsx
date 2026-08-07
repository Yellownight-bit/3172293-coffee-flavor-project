// src/features/products/components/ProductRowActions.jsx

// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";

// Hook de React Router para navegar entre rutas
import { useNavigate } from "react-router-dom";

// Componente que renderiza las acciones de cada fila de productos
// Recibe como prop el objeto product
export default function ProductRowActions({ product }) {

  // Hook que permite navegar entre rutas
  const navigate = useNavigate();

  // Acción para editar el producto
  const handleEdit = () => {
    navigate(`/products/${product.id}/edit`);
  };

  // Acción para eliminar el producto
  const handleDelete = () => {
    console.log("Eliminar producto", product.id);
  };

  // Acción para ver el producto
  const handleView = () => {

    // Producto 1 - Café americano
    if (product.id === 1) {
      navigate("/dashboard/readMenu1");
    }

    // Producto 2 - Capuccino
    else if (product.id === 3) {
      navigate("/dashboard/readMenu2");
    }

    // Producto 3 - Croissant
    else if (product.id === 4) {
      navigate("/dashboard/readMenu3");
    }

    // Producto 4 - Torta de chocolate
    else if (product.id === 2) {
      navigate("/dashboard/readMenu4");
    }

  };

  return (
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