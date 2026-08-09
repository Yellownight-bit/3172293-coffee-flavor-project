// src/users/pages/UserListPage.js

import { DataTable } from "@/shared";
import { UserColumns } from "../table/UserColumns";
import { users } from "../data/users";
import { Button } from "../../../shared";
import { Link } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { useState } from "react";

export default function UserListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Listador de Usuarios
          </h1>

          <div className="flex gap-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsReportModalOpen(true)}
            >
              Reportar usuario
            </Button>

            <Link to="/CreateUser">
              <Button size="sm" variant="primary">
                Crear usuario
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
          <DataTable data={users} columns={UserColumns} />
        </div>
      </div>

      {/* Modal */}
      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}