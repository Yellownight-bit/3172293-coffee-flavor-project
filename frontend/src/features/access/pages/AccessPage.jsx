// frontend/src/features/access/pages/AccessPage.jsx
// Estado compartido entre Sidebar y PermissionModule: el estado de edición vive en AccessPage.

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../../shared";
import AccessSidebar from "../../../shared/components/AccessSidebar";
import PermissionModule from "../components/PermissionModule";
import { getAllPermissions } from "../services/permissionService";
import { updateGroupPermissions } from "../services/groupService";

// Red de seguridad: ningún campo de los hijos puede ser más ancho que su caja
const fieldFix =
  "[&_input]:max-w-full [&_input]:min-w-0 [&_select]:max-w-full [&_select]:min-w-0 [&_textarea]:max-w-full [&_textarea]:min-w-0";

export default function AccessPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");

  // Catálogo completo de permisos (PostgreSQL)
  const [allPermissions, setAllPermissions] = useState([]);

  // Permisos asignados al grupo seleccionado
  const [groupPermissions, setGroupPermissions] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [permissionsDraft, setPermissionsDraft] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    getAllPermissions().then(setAllPermissions).catch(console.error);
  }, []);

  useEffect(() => {
    setPermissionsDraft(groupPermissions);
    setIsEditing(false);
  }, [groupPermissions]);

  // Cambiar de grupo limpia los avisos anteriores
  useEffect(() => {
    setSaveError("");
    setJustSaved(false);
  }, [selectedGroup]);

  // El aviso de "guardado" desaparece solo
  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [justSaved]);

  // ¿El borrador es distinto de lo que ya está guardado?
  const hasChanges = useMemo(() => {
    const saved = new Set(groupPermissions.map((p) => p.permission_id));
    const draft = new Set(permissionsDraft.map((p) => p.permission_id));
    if (saved.size !== draft.size) return true;
    for (const id of draft) if (!saved.has(id)) return true;
    return false;
  }, [groupPermissions, permissionsDraft]);

  const handleEdit = () => {
    setSaveError("");
    setJustSaved(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPermissionsDraft(groupPermissions);
    setSaveError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      const permissionIds = permissionsDraft.map(
        (permission) => permission.permission_id,
      );

      await updateGroupPermissions(selectedGroup, permissionIds);

      setGroupPermissions(permissionsDraft);
      setIsEditing(false);
      setJustSaved(true);
    } catch (error) {
      console.error(error);
      setSaveError(
        "No se pudieron guardar los permisos. Revisa tu conexión e inténtalo de nuevo.",
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
            Elige un grupo para ver qué puede hacer en el sistema y ajustar sus
            permisos.
          </p>
        </header>

        <div
          className={`grid items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] ${fieldFix}`}
        >
          <div className="min-w-0 lg:sticky lg:top-6">
            <AccessSidebar
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              setSelectedGroupName={setSelectedGroupName}
              setGroupPermissions={setGroupPermissions}
            />
          </div>

          <div
            aria-busy={isSaving}
            className={`min-w-0 transition-opacity ${
              isSaving ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <PermissionModule
              selectedGroupName={selectedGroupName}
              isEditing={isEditing}
              hasChanges={hasChanges}
              saveError={saveError}
              justSaved={justSaved}
              allPermissions={allPermissions}
              permissionsDraft={permissionsDraft}
              setPermissionsDraft={setPermissionsDraft}
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