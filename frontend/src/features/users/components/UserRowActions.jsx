
import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  showConfirmDeleteAlert,
  showCancelDeleteAlert,
  showSuccessAlert,
} from "@/shared";
import { checkUserPermission } from "@/features/access/services/permissionService";

export default function UserRowActions({ user }) {
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState({
    update_user: false,
    delete_user: false,
  });

  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const [canUpdate, canDelete] = await Promise.all([
          checkUserPermission("update_user"),
          checkUserPermission("delete_user"),
        ]);

        setPermissions({
          update_user: canUpdate,
          delete_user: canDelete,
        });
      } catch (error) {
        console.error("Error verificando permisos de acciones:", error);
      } finally {
        setPermissionsLoaded(true);
      }
    };

    loadPermissions();
  }, []);

  const editDisabled =
    !permissionsLoaded || !permissions.update_user;

  const deleteDisabled =
    !permissionsLoaded || !permissions.delete_user;

  // Editar usuario
  const handleEdit = () => {
    if (!permissions.update_user) return;

    navigate(`/UpdateUser/${user.id}`);
  };

  // Eliminar usuario
  const handleDelete = async () => {
    if (!permissions.delete_user) return;

    const result = await showConfirmDeleteAlert({
      title: "¿Eliminar usuario?",
      text: `¿Estás seguro de eliminar al usuario ${user.user_name}?`,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
    });

    if (result.isConfirmed) {
      console.log("Eliminar usuario", user.id);

      await showSuccessAlert({
        title: "Usuario eliminado",
        text: "El usuario se eliminó correctamente.",
        confirmButtonText: "Aceptar",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await showCancelDeleteAlert({
        title: "Eliminación cancelada",
        text: "El usuario no fue eliminado.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Ver usuario
  const handleView = () => {
    navigate(`/dashboard/userRead/${user.id}`);
  };

  return (
    <div className="flex gap-2">
      {/* Editar */}
      <span
        className={editDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        title={
          editDisabled
            ? "No tienes permiso para editar usuarios"
            : "Editar usuario"
        }
      >
        <span className={editDisabled ? "pointer-events-none" : ""}>
          <button
            type="button"
            onClick={handleEdit}
            disabled={editDisabled}
            className="p-1 rounded hover:bg-panel-muted"
          >
            <Pencil size={16} />
          </button>
        </span>
      </span>

      {/* Eliminar */}
      <span
        className={deleteDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        title={
          deleteDisabled
            ? "No tienes permiso para eliminar usuarios"
            : "Eliminar usuario"
        }
      >
        <span className={deleteDisabled ? "pointer-events-none" : ""}>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteDisabled}
            className="p-1 rounded hover:bg-panel-muted"
          >
            <Trash2 size={16} />
          </button>
        </span>
      </span>

      {/* Ver */}
      <button
        type="button"
        onClick={handleView}
        className="p-1 rounded hover:bg-panel-muted"
        title="Ver usuario"
      >
        <Eye size={16} />
      </button>
    </div>
  );
}
