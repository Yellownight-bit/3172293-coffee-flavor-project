// frontend/src/features/access/components/PermissionModule.jsx
// Estado de edición y borrador viven en AccessPage

import { Checkbox, Button, IconButton } from "@/shared";
import { Pencil, ShieldCheck } from "lucide-react";

export default function PermissionModule({
    selectedGroupName,
    isEditing,
    hasChanges = false,
    saveError = "",
    justSaved = false,
    allPermissions = [],
    permissionsDraft = [],
    setPermissionsDraft,
    onEdit,
    onCancel,
    onSave,
}) {
    const hasPermission = (codename) => {
        return permissionsDraft.some(
            (permission) => permission.permission_codename === codename,
        );
    };

    const handlePermissionChange = (permission, checked) => {
        if (!checked) {
            setPermissionsDraft((prev) =>
                prev.filter(
                    (item) => item.permission_codename !== permission.permission_codename,
                ),
            );
            return;
        }
        setPermissionsDraft((prev) => [...prev, permission]);
    };

    // Agrupar permisos por módulo
    const permissionsByModule = allPermissions.reduce((groupedPermissions, permission) => {
        const moduleName = permission.display_name; // Clave de agrupación

        if (!groupedPermissions[moduleName]) {
            groupedPermissions[moduleName] = [];
        }

        groupedPermissions[moduleName].push(permission);

        return groupedPermissions;
    }, {});

    const modules = Object.entries(permissionsByModule);

    // Estado vacío: todavía no hay grupo elegido
    if (!selectedGroupName) {
        return (
            <section className="flex min-h-[320px] min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
                <div
                    aria-hidden="true"
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800"
                >
                    <ShieldCheck size={24} />
                </div>
                <p className="font-medium">Selecciona un grupo</p>
                <p className="mt-1 max-w-xs text-sm text-stone-600">
                    Elígelo en el panel de la izquierda y aquí verás sus permisos.
                </p>
            </section>
        );
    }

    return (
        <section className="min-w-0 rounded-xl border border-stone-200 bg-white shadow-sm">
            {/* Cabecera */}
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-6 py-4">
                <div className="min-w-0">
                    <p className="text-sm text-stone-500">Grupo</p>
                    <h2 className="truncate text-lg font-semibold">{selectedGroupName}</h2>
                </div>

                <div className="flex items-center gap-2">
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
                        <IconButton ariaLabel="Editar permisos" onClick={onEdit}>
                            <Pencil size={20} />
                        </IconButton>
                    )}
                </div>
            </header>

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
                    const granted = permissions.filter((p) =>
                        hasPermission(p.permission_codename),
                    ).length;

                    return (
                        <div key={moduleName} className="py-6">
                            <div className="mb-4 flex items-baseline justify-between gap-4">
                                <h3 className="font-medium">Módulo {moduleName}</h3>
                                <span className="shrink-0 text-sm text-stone-500">
                                    {granted} de {permissions.length}
                                </span>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {permissions.map((permission) => {
                                    const checked = hasPermission(permission.permission_codename);

                                    return (
                                        <div
                                            key={permission.permission_id}
                                            className={`min-w-0 break-words rounded-lg border px-3 py-2.5 transition-colors ${
                                                checked
                                                    ? "border-amber-300 bg-amber-50"
                                                    : "border-stone-200 bg-white"
                                            }`}
                                        >
                                            <Checkbox
                                                id={permission.permission_codename}
                                                name={permission.permission_codename}
                                                label={permission.permission_name}
                                                checked={checked}
                                                disabled={!isEditing}
                                                onChange={(e) =>
                                                    handlePermissionChange(permission, e.target.checked)
                                                }
                                            />
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
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="button" variant="primary" onClick={onSave}>
                        Guardar
                    </Button>
                </footer>
            )}
        </section>
    );
}