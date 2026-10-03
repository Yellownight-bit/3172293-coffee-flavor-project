import { useState } from "react";
import { DataTable, Button, ListReportModal } from "@/shared";
import { suppliersColumns } from "../table/SuppliersColumns";
import { suppliers } from "../data/suppliers";
import { Link } from "react-router-dom";

const suppliersReportFields = [
  { key: "id", label: "NIT", default: true },
  { key: "companyName", label: "Nombre", default: true },
  { key: "supplierEmail", label: "Email", default: true },
  { key: "supplierPhone", label: "Telefono", default: true },
  { key: "isActive", label: "Estado", default: true },
];

export default function SupplierListPage() {
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
            Listado de proveedores
          </h1>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsReportOpen(true)}
            >
              Generar reporte
            </Button>

            <Link to="/CreateSupplier">
              <Button variant="primary">
                Crear proveedor
              </Button>
            </Link>
          </div>
        </div>
        
          <DataTable
            data={suppliers}
            columns={suppliersColumns}
          />
      </div>

      {/* Modal de reporte */}
      <ListReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="proveedores"
        data={suppliers}
        fields={suppliersReportFields}
        filePrefix="suppliers"
      />
    </div>
  );
}