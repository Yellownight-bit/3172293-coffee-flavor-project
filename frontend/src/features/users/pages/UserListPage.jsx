
import { DataTable } from "@/shared";
import { UserColumns } from "../table/UserColumns";
import { Button } from "../../../shared";
import { useNavigate } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { useState, useEffect } from "react";
import {
  getAllUsers,
  updateStatusSwitch,
} from "../services/userServices.js";
import { checkUserPermission } from "@/features/access/services/permissionService";

export default function UserListPage() {
  const navigate = useNavigate();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const [permissions, setPermissions] = useState({
    create_user: false,
    report_user: false,
    disable_user: false,
  });

  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, canCreate, canReport, canDisable] =
          await Promise.all([
            getAllUsers(),
            checkUserPermission("create_user"),
            checkUserPermission("report_user"),
            checkUserPermission("disable_user"),
          ]);

        setUsers(usersData);

        setPermissions({
          create_user: canCreate,
          report_user: canReport,
          disable_user: canDisable,
        });
      } catch (error) {
        console.error("Error cargando usuarios o permisos:", error);
      } finally {
        setPermissionsLoaded(true);
      }
    };

    loadData();
  }, []);

  const handleStatusChange = async (id, value) => {
    await updateStatusSwitch(id, value);

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id ? { ...user, is_active: value } : user
      )
    );
  };

  const columns = UserColumns(
    handleStatusChange,
    permissionsLoaded && permissions.disable_user
  );

  const reportDisabled =
    !permissionsLoaded || !permissions.report_user;

  const createDisabled =
    !permissionsLoaded || !permissions.create_user;

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-text-primary">
            Listador de Usuarios
          </h1>

          <div className="flex gap-4">
            <span
              className={`inline-flex ${
                reportDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              title={
                reportDisabled
                  ? "No tienes permiso para reportar usuarios"
                  : ""
              }
            >
              <span className={reportDisabled ? "pointer-events-none" : ""}>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={reportDisabled}
                  onClick={() => {
                    if (!reportDisabled) {
                      setIsReportModalOpen(true);
                    }
                  }}
                >
                  Reportar usuario
                </Button>
              </span>
            </span>

            <span
              className={`inline-flex ${
                createDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              title={
                createDisabled
                  ? "No tienes permiso para crear usuarios"
                  : ""
              }
            >
              <span className={createDisabled ? "pointer-events-none" : ""}>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={createDisabled}
                  onClick={() => {
                    if (!createDisabled) {
                      navigate("/CreateUser");
                    }
                  }}
                >
                  Crear usuario
                </Button>
              </span>
            </span>
          </div>
        </div>

        <DataTable data={users} columns={columns} />
      </div>

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        users={users}
      />
    </div>
  );
}
