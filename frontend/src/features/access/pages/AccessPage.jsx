
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../../shared";
import AccessSidebar from "../../../shared/components/AccessSidebar";
import PermissionModule from "../components/PermissionModule";
import {
    getAllPermissions,
    updateUserPermissions,
} from "../services/permissionService";
import { updateGroupPermissions } from "../services/groupService";

const fieldFix =
    "[&_input]:max-w-full [&_input]:min-w-0 [&_select]:max-w-full [&_select]:min-w-0 [&_textarea]:max-w-full [&_textarea]:min-w-0";

export default function AccessPage() {
    // Selección de grupo
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedGroupName, setSelectedGroupName] = useState("");

    // Selección de usuario
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedUserName, setSelectedUserName] = useState("");

    // Catálogo de permisos
    const [allPermissions, setAllPermissions] = useState([]);

    // Permisos del grupo
    const [groupPermissions, setGroupPermissions] = useState([]);

    // Permisos del usuario
    const [userPermissionDetails, setUserPermissionDetails] = useState({
        directPermissions: [],
        inheritedPermissions: [],
    });

    // Estado de edición
    const [isEditing, setIsEditing] = useState(false);
    const [permissionsDraft, setPermissionsDraft] = useState([]);

    // Estado de guardado
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [justSaved, setJustSaved] = useState(false);

    // Cargar catálogo de permisos
    useEffect(() => {
        getAllPermissions()
            .then(setAllPermissions)
            .catch(console.error);
    }, []);

    // Determinar los permisos que se están mostrando
    const currentPermissions = selectedUserId
        ? userPermissionDetails.directPermissions
        : groupPermissions;

    // Restablecer borrador cuando cambian los permisos seleccionados
    useEffect(() => {
        setPermissionsDraft(currentPermissions);
        setIsEditing(false);
    }, [currentPermissions]);

    // Limpiar mensajes al cambiar de selección
    useEffect(() => {
        setSaveError("");
        setJustSaved(false);
    }, [selectedGroup, selectedUserId]);

    // Ocultar mensaje de guardado después de tres segundos
    useEffect(() => {
        if (!justSaved) return;

        const timer = setTimeout(() => setJustSaved(false), 3000);

        return () => clearTimeout(timer);
    }, [justSaved]);

    // Detectar cambios en los permisos
    const hasChanges = useMemo(() => {
        const saved = new Set(
            currentPermissions.map((permission) => permission.permission_id)
        );

        const draft = new Set(
            permissionsDraft.map((permission) => permission.permission_id)
        );

        if (saved.size !== draft.size) return true;

        for (const id of draft) {
            if (!saved.has(id)) return true;
        }

        return false;
    }, [currentPermissions, permissionsDraft]);

    // Editar permisos
    const handleEdit = () => {
        setSaveError("");
        setJustSaved(false);
        setIsEditing(true);
    };

    // Cancelar edición
    const handleCancel = () => {
        setPermissionsDraft(currentPermissions);
        setSaveError("");
        setIsEditing(false);
    };

    // Guardar permisos
    const handleSave = async () => {
        setIsSaving(true);
        setSaveError("");

        try {
            const permissionIds = permissionsDraft.map(
                (permission) => permission.permission_id
            );

            if (selectedUserId) {
                await updateUserPermissions(
                    Number(selectedUserId),
                    permissionIds
                );

                setUserPermissionDetails((previous) => ({
                    ...previous,
                    directPermissions: permissionsDraft,
                }));
            } else if (selectedGroup) {
                await updateGroupPermissions(
                    selectedGroup,
                    permissionIds
                );

                setGroupPermissions(permissionsDraft);
            } else {
                throw new Error(
                    "Debes seleccionar un grupo o un usuario."
                );
            }

            setIsEditing(false);
            setJustSaved(true);
        } catch (error) {
            console.error(error);

            setSaveError(
                error.message ||
                "No se pudieron guardar los permisos. Revisa tu conexión e inténtalo de nuevo."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">
            <Navbar />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Gestión de permisos
                    </h1>

                    <p className="mt-1 max-w-xl text-sm text-stone-600">
                        Elige un grupo o un usuario para consultar y administrar
                        sus permisos en el sistema.
                    </p>
                </header>

                <div
                    className={`grid items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] ${fieldFix}`}
                >
                    <div className="min-w-0 lg:sticky lg:top-6">
                        <AccessSidebar
                            selectedGroup={selectedGroup}
                            setSelectedGroup={setSelectedGroup}
                            setGroupPermissions={setGroupPermissions}
                            setSelectedGroupName={setSelectedGroupName}
                            setSelectedUserId={setSelectedUserId}
                            setSelectedUserName={setSelectedUserName}
                            setUserPermissionDetails={setUserPermissionDetails}
                        />
                    </div>

                    <div
                        aria-busy={isSaving}
                        className={`min-w-0 transition-opacity ${
                            isSaving
                                ? "pointer-events-none opacity-60"
                                : ""
                        }`}
                    >
                        <PermissionModule
                            selectedGroupName={selectedGroupName}
                            selectedUserName={selectedUserName}
                            isUserSelected={Boolean(selectedUserId)}
                            isEditing={isEditing}
                            hasChanges={hasChanges}
                            saveError={saveError}
                            justSaved={justSaved}
                            allPermissions={allPermissions}
                            permissionsDraft={permissionsDraft}
                            setPermissionsDraft={setPermissionsDraft}
                            inheritedPermissions={
                                userPermissionDetails.inheritedPermissions
                            }
                            onEdit={handleEdit}
                            onCancel={handleCancel}
                            onSave={handleSave}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
