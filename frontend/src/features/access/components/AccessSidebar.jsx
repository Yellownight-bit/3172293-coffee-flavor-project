// Componente AccessSidebar (módulo Accesos)

import { useEffect, useId, useState } from "react";
import { Select } from "@/shared";
import { getGroups } from "@/features/access/services/groupService";
import {
  getGroupPermissions,
  getUserPermissionDetails,
} from "@/features/access/services/permissionService";
import { getUsersForPermissions } from "@/features/users/services/userServices";

const EMPTY_USER_PERMISSIONS = {
  directPermissions: [],
  inheritedPermissions: [],
};

export default function AccessSidebar({
  selectedGroup,
  setSelectedGroup,
  setGroupPermissions,
  setSelectedGroupName,
  setSelectedUserId,
  setSelectedUserName,
  setUserPermissionDetails,
}) {
  const groupTitleId = useId();
  const userTitleId = useId();

  const [userId, setUserId] = useState("");
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadError, setLoadError] = useState("");

  // Obtener grupos
  useEffect(() => {
    getGroups()
      .then(setGroups)
      .catch((error) => {
        console.error("Error cargando grupos:", error);
        setLoadError("No se pudieron cargar los grupos o usuarios.");
      });
  }, []);

  // Obtener usuarios para administrar permisos
  useEffect(() => {
    getUsersForPermissions()
      .then((data) =>
        setUsers(
          data.map((user) => ({
            value: String(user.id),
            label: user.user_name,
          }))
        )
      )
      .catch((error) => {
        console.error("Error cargando usuarios:", error);
        setLoadError("No se pudieron cargar los grupos o usuarios.");
      });
  }, []);

  // Opciones de grupos
  const groupOptions = groups.map((group) => ({
    value: String(group.group_id),
    label: group.group_name,
  }));

  // Seleccionar grupo
  const handleGroupChange = async (e) => {
    const groupId = e.target.value;
    const group = groups.find((g) => String(g.group_id) === groupId);

    setSelectedGroup(groupId);
    setSelectedGroupName(group?.group_name ?? "");

    setUserId("");
    setSelectedUserId("");
    setSelectedUserName("");
    setUserPermissionDetails(EMPTY_USER_PERMISSIONS);

    if (!groupId) {
      setGroupPermissions([]);
      return;
    }

    try {
      const permissions = await getGroupPermissions(groupId);
      setGroupPermissions(permissions);
    } catch (error) {
      console.error("Error cargando permisos del grupo:", error);
      setGroupPermissions([]);
    }
  };

  // Seleccionar usuario individual
  const handleUserChange = async (e) => {
    const selectedId = e.target.value;
    const selectedUser = users.find((user) => String(user.value) === selectedId);

    setUserId(selectedId);
    setSelectedUserId(selectedId);
    setSelectedUserName(selectedUser?.label ?? "");

    setSelectedGroup("");
    setSelectedGroupName("");
    setGroupPermissions([]);
    setUserPermissionDetails(EMPTY_USER_PERMISSIONS);

    if (!selectedId) return;

    try {
      const permissions = await getUserPermissionDetails(selectedId);
      setUserPermissionDetails(permissions);
    } catch (error) {
      console.error("Error cargando permisos del usuario:", error);
    }
  };

  return (
    <div className="w-full min-w-0 rounded-xl border border-border-soft bg-panel p-4 shadow-sm">
      {loadError && (
        <p role="alert" className="mb-4 text-small text-error">
          {loadError}
        </p>
      )}

      <section className="min-w-0">
        <h2 id={groupTitleId} className="mb-2 text-medium font-semibold text-text-primary">
          Grupo de usuarios
        </h2>

        <Select
          name="groupId"
          value={selectedGroup}
          onChange={handleGroupChange}
          options={groupOptions}
          placeholder="Seleccione un grupo"
          aria-labelledby={groupTitleId}
        />
      </section>

      {/* Separador "o" (decorativo) */}
      <div
        aria-hidden="true"
        className="my-5 flex items-center gap-3 text-small text-text-muted"
      >
        <span className="h-px flex-1 bg-border-soft" />
        o
        <span className="h-px flex-1 bg-border-soft" />
      </div>

      <section className="min-w-0">
        <h2 id={userTitleId} className="mb-2 text-medium font-semibold text-text-primary">
          Usuario individual
        </h2>

        <Select
          name="userId"
          value={userId}
          onChange={handleUserChange}
          options={users}
          placeholder="Seleccione un usuario"
          aria-labelledby={userTitleId}
        />
      </section>
    </div>
  );
}