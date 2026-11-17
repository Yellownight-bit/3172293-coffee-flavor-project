// frontend/src/shared/components/AccessSidebar.jsx

import { useState, useEffect } from "react";
import { Select } from "@/shared";
import { getGroups } from "../../features/access/services/groupService";
import { getGroupPermissions } from "../../features/access/services/permissionService";

export default function AccessSidebar({
    selectedGroup,
    setSelectedGroup,
    setGroupPermissions,
    setSelectedGroupName,
}) {
    // Usuario individual seleccionado
    const [userId, setUserId] = useState("");

    // Estado de los grupos
    const [groups, setGroups] = useState([]);

    // Efecto para obtener grupos (test)
    useEffect(() => {
        getGroups().then(setGroups).catch(console.error);
    }, []);

    // Mapear los datos reales para el Select
    const groupOptions = groups.map((group) => ({
        value: String(group.group_id),
        label: group.group_name,
    }));

    const handleGroupChange = async (e) => {
        const groupId = e.target.value;
        const group = groups.find((g) => String(g.group_id) === groupId);

        setSelectedGroup(groupId);
        setSelectedGroupName(group?.group_name ?? "");
        setUserId("");

        // Sin grupo seleccionado: se limpia todo y no se llama al backend
        if (!groupId) {
            setGroupPermissions([]);
            return;
        }

        try {
            const permissions = await getGroupPermissions(groupId);
            setGroupPermissions(permissions);
        } catch (error) {
            console.error(error);
        }
    };

    const userOptions = [
        { value: 10, label: "Sebastián Arce" },
        { value: 11, label: "Sofia Valencia" },
        { value: 12, label: "José Marín" },
    ];

    // Ancho fluido: lo define la columna de la página, no un valor fijo
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

            {/* Elegir uno limpia el otro, por eso se separan con "o" */}
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
                        onChange={(e) => {
                            setUserId(e.target.value);
                            setSelectedGroup("");
                            setSelectedGroupName("");
                            setGroupPermissions([]);
                        }}
                        options={userOptions}
                    />
                </div>
            </section>
        </div>
    );
}