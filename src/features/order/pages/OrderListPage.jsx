import { useState } from "react";
import { DataTable, Button, ListReportModal } from "@/shared";
import { orderColumns } from "../table/OrderColumns";
import { orders } from "../data/order";
import { Link } from "react-router-dom";

const orderReportFields = [
  { key: "id", label: "ID", default: true },
  { key: "tableNumber", label: "Mesa", default: true },
  { key: "waiter", label: "Mesero", default: true },
  { key: "status", label: "Estado", default: true },
  { key: "date", label: "Fecha", default: true },
  { key: "total", label: "Valor total", default: true },
];

export default function OrderListPage() {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="p-6">

      {/* Contenedor principal */}
      <div
        className="
          bg-white/90
          rounded-2xl
          p-6
          shadow-sm
          border border-gray-200
        "
      >

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">

          <h1 className="text-xl font-semibold text-gray-900">
            Listado de órdenes
          </h1>

          <div className="flex items-center gap-3">

            <Button
              variant="secondary"
              onClick={() => setIsReportOpen(true)}
            >
              Generar reporte
            </Button>

            <Link to="/CreateOrder">
              <Button variant="primary">
                Crear orden
              </Button>
            </Link>

          </div>
        </div>

        {/* Tabla */}
        <div
          className="
            rounded-lg
            overflow-hidden
            bg-white
            shadow-sm
            border border-gray-200
          "
        >
          <DataTable
            data={orders}
            columns={orderColumns}
          />
        </div>

      </div>

      {/* Modal de reporte */}
      <ListReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="órdenes"
        data={orders}
        fields={orderReportFields}
        filePrefix="orders"
      />

    </div>
  );
}