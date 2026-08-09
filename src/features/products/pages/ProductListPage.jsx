import { useState } from "react";
import { DataTable, Button, ListReportModal } from "@/shared";
import { productColumns } from "../table/ProductColumns";
import { products } from "../data/products";
import { Link } from "react-router-dom";

const productReportFields = [
  { key: "title", label: "Producto", default: true },
  { key: "price", label: "Precio", default: true },
  { key: "description", label: "Descripción", default: true },
  { key: "category", label: "Categoría", default: true },
];

export default function ProductListPage() {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Contenedor principal */}
      <div
        className="
          rounded-2xl
          bg-white/80
          backdrop-blur-md
          shadow-lg
          p-6
          border border-white/40
        "
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Listado de Menús
          </h1>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => setIsReportOpen(true)}
            >
              Generar reporte
            </Button>

            <Link to="/CreateProduct">
              <Button variant="primary">
                Crear producto
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabla */}
        <div
          className="
            rounded-xl
            overflow-hidden
            bg-white/95
            shadow-md
            border border-gray-200
          "
        >
          <DataTable
            data={products}
            columns={productColumns}
          />
        </div>
      </div>

      {/* Modal de reportes */}
      <ListReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="productos"
        data={products}
        fields={productReportFields}
        filePrefix="products"
      />
    </div>
  );
}