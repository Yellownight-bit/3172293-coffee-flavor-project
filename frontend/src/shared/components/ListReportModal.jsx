// Componente ListReportModal
// Diálogo para generar reportes PDF/Excel de una lista, alineado a Material Design 3:
// - Accesible: role="dialog", aria-modal, título ligado, foco al abrir y devuelto al cerrar.
// - Se cierra con Escape, con clic en el fondo o con "Cancelar".
// - Adaptable: margen en móvil y scroll interno si hay muchos campos.
// - Colores, tamaños y radios solo con tokens.
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import Checkbox from "./Checkbox";
import Select from "./Select";
import { generateExcelReport } from "../../features/users/reports/services/generateExcelReport";
import { generatePdfReport } from "../../features/users/reports/services/generatePdfReport";

// Convierte el valor de un campo en texto para el reporte
const formatValue = (key, value) => {
  if (key === "is_active") {
    if (value === true) return "Activo";
    if (value === false) return "Inactivo";
    return "";
  }

  if (key === "dishes") {
    if (!Array.isArray(value) || value.length === 0) return "Sin productos";
    return value
      .map((dish) => dish.productName || dish.product_name || dish.name || "Producto")
      .join(", ");
  }

  return value ?? "";
};

export default function ListReportModal({
  isOpen,
  onClose,
  title,
  data = [],
  fields = [],
  filePrefix = "reporte",
}) {
  const titleId = useId();
  const dialogRef = useRef(null);

  const [format, setFormat] = useState("pdf");
  const [error, setError] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(() =>
    fields.filter((field) => field.default).map((field) => field.key)
  );

  const handleClose = () => {
    setError("");
    onClose();
  };

  // Foco: al abrir va al primer campo; al cerrar vuelve al botón que abrió el diálogo
  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    dialogRef.current?.querySelector("select, input, button")?.focus();

    return () => previousFocus?.focus?.();
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleField = (key) => {
    setSelectedKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  const handleGenerate = async () => {
    const selectedFields = fields.filter((field) => selectedKeys.includes(field.key));
    const headers = selectedFields.map((field) => field.label);
    const rows = data.map((item) =>
      selectedFields.map((field) => formatValue(field.key, item[field.key]))
    );

    const timestamp = new Date().toISOString().split("T")[0];
    const fileName = `${filePrefix}-report-${timestamp}`;

    try {
      if (format === "excel") {
        await generateExcelReport({ headers, rows, fileName: `${fileName}.xlsx` });
      } else {
        await generatePdfReport({ headers, rows, fileName: `${fileName}.pdf` });
      }
      handleClose();
    } catch (err) {
      console.error("Error al generar el reporte:", err);
      setError("No se pudo generar el reporte. Intenta de nuevo.");
    }
  };

  return createPortal(
    // Fondo: clic fuera del diálogo lo cierra
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-overlay/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-full w-full max-w-md flex-col overflow-y-auto rounded-3xl bg-panel p-6 shadow-2xl"
      >
        <h2 id={titleId} className="mb-6 font-heading text-subtitle text-text-primary">
          Generar reporte de {title}
        </h2>

        <Select
          label="Formato del reporte"
          htmlFor="report-format"
          value={format}
          onChange={(event) => setFormat(event.target.value)}
          options={[
            { label: "PDF", value: "pdf" },
            { label: "Excel", value: "excel" },
          ]}
        />

        {/* Campos que se incluyen en el reporte */}
        <fieldset className="mt-6">
          <legend className="mb-1 text-medium font-semibold text-text-secondary">
            Campos del reporte
          </legend>

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            {fields.map((field) => (
              <Checkbox
                key={field.key}
                id={`${filePrefix}-${field.key}`}
                label={field.label}
                checked={selectedKeys.includes(field.key)}
                onChange={() => toggleField(field.key)}
              />
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="mt-4 text-small text-error">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="cancel" onClick={handleClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={!format || selectedKeys.length === 0}
          >
            Generar reporte
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}