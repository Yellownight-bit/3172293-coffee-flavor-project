
import { useState, useEffect } from "react";
import { Select } from "@/shared";
import { getGroups } from "../../features/access/services/groupService";
import {
    getGroupPermissions,
    getUserPermissionDetails,
} from "../../features/access/services/permissionService";
import { getUsersForPermissions } from "@/features/users/services/userServices";

export default function AccessSidebar({
    selectedGroup,
    setSelectedGroup,
    setGroupPermissions,
    setSelectedGroupName,
    setSelectedUserId,
    setSelectedUserName,
    setUserPermissionDetails,
}) {
    const [userId, setUserId] = useState("");
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);

    // Obtener grupos
    useEffect(() => {
        getGroups()
            .then(setGroups)
            .catch(console.error);
    }, []);

    // Obtener usuarios para administrar permisos
    useEffect(() => {
        getUsersForPermissions()
            .then((data) => {
                setUsers(
                    data.map((user) => ({
                        value: String(user.id),
                        label: user.user_name,
                    }))
                );
            })
            .catch(console.error);
    }, []);

    // Opciones de grupos
    const groupOptions = groups.map((group) => ({
        value: String(group.group_id),
        label: group.group_name,
    }));

    const userOptions = users;

    // Seleccionar grupo
    const handleGroupChange = async (e) => {
        const groupId = e.target.value;

        const group = groups.find(
            (g) => String(g.group_id) === groupId
        );

        setSelectedGroup(groupId);
        setSelectedGroupName(group?.group_name ?? "");

        setUserId("");
        setSelectedUserId("");
        setSelectedUserName("");
        setUserPermissionDetails({
            directPermissions: [],
            inheritedPermissions: [],
        });

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

        const selectedUser = users.find(
            (user) => String(user.value) === selectedId
        );

        setUserId(selectedId);
        setSelectedUserId(selectedId);
        setSelectedUserName(selectedUser?.label ?? "");

        setSelectedGroup("");
        setSelectedGroupName("");
        setGroupPermissions([]);

        setUserPermissionDetails({
            directPermissions: [],
            inheritedPermissions: [],
        });

        if (!selectedId) {
            return;
        }

        try {
            const permissions = await getUserPermissionDetails(selectedId);
            setUserPermissionDetails(permissions);
        } catch (error) {
            console.error("Error cargando permisos del usuario:", error);
        }
    };

    return (
        <div className="w-full min-w-0 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <section className="min-w-0">
                <h2 className="mb-3 text-sm font-semibold text-stone-800">
                    Grupo de usuarios
                </h2>

                <div className="min-w-0 [&_select]:w-full">
                    <Select
                        name="groupId"
                        value={selectedGroup}
                        onChange={handleGroupChange}
                        options={groupOptions}
                    />
                </div>
            </section>

            <div
                aria-hidden="true"
                className="my-5 flex items-center gap-3 text-xs text-stone-400"
            >
                <span className="h-px flex-1 bg-stone-200" />
                o
                <span className="h-px flex-1 bg-stone-200" />
            </div>

            <section className="min-w-0">
                <h2 className="mb-3 text-sm font-semibold text-stone-800">
                    Usuario individual
                </h2>

                <div className="min-w-0 [&_select]:w-full">
                    <Select
                        name="userId"
                        value={userId}
                        onChange={handleUserChange}
                        options={userOptions}
                    />
                </div>
            </section>
        </div>
    );
}
