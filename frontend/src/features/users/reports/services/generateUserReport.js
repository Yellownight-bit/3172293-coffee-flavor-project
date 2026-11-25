
import { buildReportDataset } from "../utils/buildReportDataset";

import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export function generateUserReport({
  users,
  format,
  selectedFields,
  scope,
  documentNumber,
}) {
  const normalizedUsers = users.map((user) => ({
    ...user,
    id: user.id,
    user_name: user.user_name ?? user.userName,
    rol: user.rol ?? user.role,
    user_email: user.user_email ?? user.userEmail,
    user_phone: user.user_phone ?? user.userPhone,
    user_document_types:
      user.user_document_types ?? user.userDocumentTypes,
    user_document_number:
      user.user_document_number ?? user.userDocumentNumber,
    is_active: user.is_active ?? user.isActive,
  }));

  const { headers, rows } = buildReportDataset({
    users: normalizedUsers,
    selectedFields,
    scope,
    documentNumber,
  });

  if (!rows.length) {
    alert("No hay datos para generar el reporte.");
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10);

  if (format === "excel") {
    generateExcelReport({
      headers,
      rows,
      fileName: `users-report-${timestamp}.xlsx`,
    });
  }

  if (format === "pdf") {
    generatePdfReport({
      headers,
      rows,
      fileName: `users-report-${timestamp}.pdf`,
    });
  }
}
