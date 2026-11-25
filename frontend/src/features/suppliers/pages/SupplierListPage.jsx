
import { useState, useEffect } from "react";
import { DataTable, Button, ListReportModal } from "@/shared";
import { suppliersColumns } from "../table/SuppliersColumns";
import { Link } from "react-router-dom";
import {
  getAllSuppliers,
  updateSupplierStatus,
} from "../services/supplierServices.js";
import { checkUserPermission } from "@/features/access/services/permissionService";

const suppliersReportFields = [
  { key: "id", label: "ID", default: true },
  { key: "supplier_name", label: "Compañía", default: true },
  { key: "supplier_document_number", label: "NIT", default: true },
  { key: "supplier_email", label: "Email", default: true },
  { key: "supplier_phone", label: "Teléfono", default: true },
  { key: "supplier_address", label: "Dirección", default: true },
  { key: "is_active", label: "Estado", default: true },
];

export default function SupplierListPage() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  const [permissions, setPermissions] = useState({
    create_supplier: false,
    report_supplier: false,
    disable_supplier: false,
  });

  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
      }
    };

    const loadPermissions = async () => {
      try {
        const [canCreate, canReport, canDisable] = await Promise.all([
          checkUserPermission("create_supplier"),
          checkUserPermission("report_supplier"),
          checkUserPermission("disable_supplier"),
        ]);

        setPermissions({
          create_supplier: canCreate,
          report_supplier: canReport,
          disable_supplier: canDisable,
        });
      } catch (error) {
        console.error("Error al verificar los permisos:", error);
        setPermissions({
          create_supplier: false,
          report_supplier: false,
          disable_supplier: false,
        });
      } finally {
        setPermissionsLoaded(true);
      }
    };

    loadSuppliers();
    loadPermissions();
  }, []);

  const handleStatusChange = async (id, value) => {
    try {
      await updateSupplierStatus(id, value);

      setSuppliers((currentSuppliers) =>
        currentSuppliers.map((supplier) =>
          supplier.id === id
            ? { ...supplier, is_active: value }
            : supplier
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const columns = suppliersColumns(
    handleStatusChange,
    permissions.disable_supplier
  );

  return (
    <div className="p-6">
      <div
        className="
          rounded-2xl
          bg-panel/80
          backdrop-blur-md
          shadow-lg
          p-6
          border border-panel/40
        "
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-text-primary">
            Listado de proveedores
          </h1>

          <div className="flex items-center gap-3">
            <span
              className={
                !permissions.report_supplier
                  ? "inline-flex cursor-not-allowed"
                  : "inline-flex"
              }
              title={
                !permissions.report_supplier
                  ? "No tienes permiso para generar reportes"
                  : ""
              }
            >
              <span
                className={
                  !permissions.report_supplier ? "pointer-events-none" : ""
                }
              >
                <Button
                  variant="secondary"
                  disabled={
                    !permissionsLoaded || !permissions.report_supplier
                  }
                  onClick={() => setIsReportOpen(true)}
                >
                  Generar reporte
                </Button>
              </span>
            </span>

            <span
              className={
                !permissions.create_supplier
                  ? "inline-flex cursor-not-allowed"
                  : "inline-flex"
              }
              title={
                !permissions.create_supplier
                  ? "No tienes permiso para crear proveedores"
                  : ""
              }
            >
              <span
                className={
                  !permissions.create_supplier ? "pointer-events-none" : ""
                }
              >
                <Link
                  to={
                    permissions.create_supplier
                      ? "/CreateSupplier"
                      : "#"
                  }
                  onClick={(event) => {
                    if (!permissions.create_supplier) {
                      event.preventDefault();
                    }
                  }}
                >
                  <Button
                    variant="primary"
                    disabled={
                      !permissionsLoaded || !permissions.create_supplier
                    }
                  >
                    Crear proveedor
                  </Button>
                </Link>
              </span>
            </span>
          </div>
        </div>

        <DataTable
          data={suppliers}
          columns={columns}
        />
      </div>

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
