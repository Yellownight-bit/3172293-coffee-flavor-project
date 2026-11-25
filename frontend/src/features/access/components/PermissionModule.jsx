
// frontend/src/features/access/components/PermissionModule.jsx

import { Checkbox, Button, IconButton } from "@/shared";
import { Pencil, ShieldCheck } from "lucide-react";

export default function PermissionModule({
    selectedGroupName,
    selectedUserName,
    isUserSelected = false,
    isEditing,
    hasChanges = false,
    saveError = "",
    justSaved = false,
    allPermissions = [],
    permissionsDraft = [],
    setPermissionsDraft,
    inheritedPermissions = [],
    onEdit,
    onCancel,
    onSave,
}) {
    // Comprobar si el permiso está asignado directamente
    const hasDirectPermission = (codename) => {
        return permissionsDraft.some(
            (permission) =>
                permission.permission_codename === codename
        );
    };

    // Comprobar si el permiso se hereda de algún grupo
    const getInheritedPermission = (codename) => {
        return inheritedPermissions.find(
            (permission) =>
                permission.permission_codename === codename
        );
    };

    // Modificar permisos del borrador
    const handlePermissionChange = (permission, checked) => {
        setPermissionsDraft((prev) => {
            if (!checked) {
                return prev.filter(
                    (item) =>
                        item.permission_codename !==
                        permission.permission_codename
                );
            }

            if (
                prev.some(
                    (item) =>
                        item.permission_codename ===
                        permission.permission_codename
                )
            ) {
                return prev;
            }

            return [...prev, permission];
        });
    };

    // Agrupar permisos por módulo
    const permissionsByModule = allPermissions.reduce(
        (groupedPermissions, permission) => {
            const moduleName = permission.display_name || "Otros";

            if (!groupedPermissions[moduleName]) {
                groupedPermissions[moduleName] = [];
            }

            groupedPermissions[moduleName].push(permission);

            return groupedPermissions;
        },
        {}
    );

    const modules = Object.entries(permissionsByModule);

    const hasSelection = Boolean(selectedGroupName || selectedUserName);

    // Estado vacío
    if (!hasSelection) {
        return (
            <section className="flex min-h-[320px] min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
                <div
                    aria-hidden="true"
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800"
                >
                    <ShieldCheck size={24} />
                </div>

                <p className="font-medium">
                    Selecciona un grupo o usuario
                </p>

                <p className="mt-1 max-w-xs text-sm text-stone-600">
                    Elige una opción en el panel de la izquierda para
                    consultar sus permisos.
                </p>
            </section>
        );
    }

    return (
        <section className="min-w-0 rounded-xl border border-stone-200 bg-white shadow-sm">
            {/* Cabecera */}
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-6 py-4">
                <div className="min-w-0">
                    <p className="text-sm text-stone-500">
                        {isUserSelected ? "Usuario individual" : "Grupo"}
                    </p>

                    <h2 className="truncate text-lg font-semibold">
                        {isUserSelected ? selectedUserName : selectedGroupName}
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {isEditing && hasChanges && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                            Cambios sin guardar
                        </span>
                    )}

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isEditing
                                ? "bg-stone-900 text-white"
                                : "bg-stone-100 text-stone-700"
                        }`}
                    >
                        {isEditing ? "Editando" : "Solo lectura"}
                    </span>

                    {!isEditing && (
                        <IconButton
                            ariaLabel="Editar permisos"
                            onClick={onEdit}
                        >
                            <Pencil size={20} />
                        </IconButton>
                    )}
                </div>
            </header>

            {/* Información de permisos individuales */}
            {isUserSelected && (
                <div className="border-b border-stone-200 bg-stone-50 px-6 py-4">
                    <p className="text-sm font-medium text-stone-800">
                        Permisos individuales y heredados
                    </p>

                    <p className="mt-1 text-sm text-stone-600">
                        Las casillas representan los permisos asignados
                        directamente al usuario. Las etiquetas indican
                        los permisos que recibe por sus grupos.
                    </p>
                </div>
            )}

            {/* Avisos */}
            {saveError && (
                <div
                    role="alert"
                    className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                    {saveError}
                </div>
            )}

            {justSaved && (
                <div
                    role="status"
                    className="mx-6 mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                >
                    Permisos guardados.
                </div>
            )}

            {/* Módulos */}
            <div className="divide-y divide-stone-200 px-6">
                {modules.length === 0 && (
                    <p className="py-8 text-sm text-stone-600">
                        No hay permisos disponibles para mostrar.
                    </p>
                )}

                {modules.map(([moduleName, permissions]) => {
                    const directCount = permissions.filter((permission) =>
                        hasDirectPermission(permission.permission_codename)
                    ).length;

                    const inheritedCount = isUserSelected
                        ? permissions.filter((permission) =>
                            getInheritedPermission(
                                permission.permission_codename
                            )
                        ).length
                        : 0;

                    return (
                        <div key={moduleName} className="py-6">
                            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="font-medium">
                                    Módulo {moduleName}
                                </h3>

                                <span className="shrink-0 text-sm text-stone-500">
                                    {isUserSelected
                                        ? `${directCount} directos · ${inheritedCount} heredados`
                                        : `${directCount} de ${permissions.length}`
                                    }
                                </span>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {permissions.map((permission) => {
                                    const direct = hasDirectPermission(
                                        permission.permission_codename
                                    );

                                    const inherited = isUserSelected
                                        ? getInheritedPermission(
                                            permission.permission_codename
                                        )
                                        : null;

                                    return (
                                        <div
                                            key={permission.permission_id}
                                            className={`min-w-0 break-words rounded-lg border px-3 py-2.5 transition-colors ${
                                                direct
                                                    ? "border-amber-300 bg-amber-50"
                                                    : inherited
                                                        ? "border-blue-200 bg-blue-50"
                                                        : "border-stone-200 bg-white"
                                            }`}
                                        >
                                            <Checkbox
                                                id={`${isUserSelected ? "user" : "group"}-${permission.permission_codename}`}
                                                name={permission.permission_codename}
                                                label={permission.permission_name}
                                                checked={direct}
                                                disabled={!isEditing}
                                                onChange={(e) =>
                                                    handlePermissionChange(
                                                        permission,
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            {inherited && (
                                                <div className="mt-2 border-t border-blue-200 pt-2">
                                                    <span className="text-xs font-medium text-blue-800">
                                                        Heredado del grupo:{" "}
                                                        {inherited.group_name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Acciones */}
            {isEditing && (
                <footer className="flex justify-end gap-3 border-t border-stone-200 px-6 py-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={onSave}
                        disabled={!hasChanges}
                    >
                        Guardar
                    </Button>
                </footer>
            )}
        </section>
    );
}
