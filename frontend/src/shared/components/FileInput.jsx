// Componente FileInput
// Selector de imágenes/archivos alineado a Material Design 3:
// - Botón real (teclado y lector de pantalla), colores solo con tokens.
// - Miniaturas de 96 px; botón "Quitar" visible en móvil, con teclado y al pasar el mouse.
// - Reordenar arrastrando las miniaturas (modo múltiple).
import { useRef, useState, useEffect, useMemo } from "react";
import { ImagePlus, X } from "lucide-react";
import { API_URL } from "@/features/config";

// Máximo de archivos permitidos en modo múltiple
const MAX_FILES = 12;

// --- Utilidades (fuera del componente: no se recrean en cada render) ---
const isFile = (item) => typeof File !== "undefined" && item instanceof File;

const isImage = (item) => {
  if (isFile(item)) return item.type.startsWith("image/");
  if (typeof item === "string") {
    return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(item);
  }
  return false;
};

const getFileName = (item) => (isFile(item) ? item.name : item.split("/").pop());

// Las imágenes guardadas vienen como ruta del backend ("/uploads/..."): se arma la URL completa
const getImageUrl = (item) => {
  if (item.startsWith("http")) return item;
  const serverUrl = API_URL.replace(/\/api\/?$/, "");
  return `${serverUrl}${item.startsWith("/") ? item : `/${item}`}`;
};

export default function FileInput({
  value = [],
  onChange,
  multiple = false,
  accept = "image/*,application/pdf",
}) {
  const inputRef = useRef(null);
  const [dragIndex, setDragIndex] = useState(null);

  // Vista previa local de las imágenes nuevas (se liberan al cambiar)
  const previews = useMemo(
    () => value.map((item) => (isFile(item) && isImage(item) ? URL.createObjectURL(item) : null)),
    [value]
  );

  useEffect(() => {
    return () => previews.forEach((url) => url && URL.revokeObjectURL(url));
  }, [previews]);

  const handleFiles = (files) => {
    if (!files?.length) return;

    const list = Array.from(files);
    const data = multiple ? [...value, ...list] : [list[0]];
    onChange(data.slice(0, MAX_FILES));

    // Permite volver a elegir el mismo archivo
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const reorder = (from, to) => {
    if (from === null || from === to) return;
    const copy = [...value];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    onChange(copy);
    setDragIndex(null);
  };

  // En modo múltiple el botón se oculta al llegar al máximo
  const showUpload = !multiple || value.length < MAX_FILES;
  const uploadText = multiple
    ? "Agregar imagen"
    : value.length > 0
      ? "Cambiar imagen"
      : "Subir imagen";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Miniaturas */}
      {value.map((item, index) => (
        <div
          key={`${getFileName(item)}-${index}`}
          draggable={multiple}
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => reorder(dragIndex, index)}
          className={`group relative size-24 overflow-hidden rounded-sm border border-border ${
            multiple ? "cursor-grab" : ""
          }`}
        >
          {isImage(item) ? (
            <img
              src={isFile(item) ? previews[index] : getImageUrl(item)}
              alt={getFileName(item)}
              className="h-full w-full object-cover"
              onError={(e) => console.error("No se pudo cargar la imagen:", e.currentTarget.src)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-panel-muted px-1 text-small text-text-secondary">
              <span className="font-semibold">PDF</span>
              <span className="w-full truncate text-center">{getFileName(item)}</span>
            </div>
          )}

          {/* Quitar: visible en móvil; en escritorio al pasar el mouse o con teclado */}
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label={`Quitar ${getFileName(item)}`}
            className="
              absolute right-1 top-1
              flex size-8 items-center justify-center
              rounded-full bg-panel text-text-primary shadow-sm
              transition-opacity
              before:absolute before:-inset-2 before:content-['']
              hover:bg-panel-muted
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
              md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100
            "
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ))}

      {/* Botón para elegir archivo */}
      {showUpload && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="
            flex size-24 flex-col items-center justify-center gap-1
            rounded-sm border-2 border-dashed border-brand bg-panel
            px-2 text-center text-small text-text-secondary
            transition-colors hover:bg-panel-muted
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
            focus-visible:ring-offset-2 focus-visible:ring-offset-background
          "
        >
          <ImagePlus size={24} aria-hidden="true" className="text-brand" />
          <span>{uploadText}</span>
        </button>
      )}

      {/* Input nativo oculto: lo abre el botón */}
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}