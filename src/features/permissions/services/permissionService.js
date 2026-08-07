export const getPermissionGroups = async () => {
  return [
    { value: "admin", label: "Administradores" },
    { value: "supervisor", label: "Supervisores" },
    { value: "operator", label: "Operadores" },
  ];
};

export const getIndividualUsers = async () => {
  return [
    { value: "1", label: "Juan Pérez" },
    { value: "2", label: "María Gómez" },
    { value: "3", label: "Carlos Rodríguez" },
  ];
};

export const savePermissions = async (data) => {
  console.log("Guardando permisos:", data);
  return { success: true };
};