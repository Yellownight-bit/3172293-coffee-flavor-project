// Función utilitaria para construir el dataset de un reporte
export function buildReportDataset({
  users,
  selectedFields,
  scope,
  documentNumber,
}) {
  // Copia inmutable del array original
  let filteredUsers = [...users];

  // Filtrar por número de documento
  if (scope === "document" && documentNumber) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        String(user.user_document_number ?? user.userDocumentNumber) ===
        String(documentNumber).trim()
    );
  }

  // Construir encabezados
  const headers = selectedFields.map((field) => field.label);

  // Construir filas
  const rows = filteredUsers.map((user) =>
    selectedFields.map((field) => {
      const value = user[field.key];

      // Mostrar el estado de forma legible
      if (field.key === "is_active") {
        return value === true ? "Activo" : value === false ? "Inactivo" : "";
      }

      return value ?? "";
    })
  );

  return {
    headers,
    rows,
  };
}