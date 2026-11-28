// Componente DataTable

import { useId, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button, Input } from "@/shared";

export default function DataTable({
  data = [],
  columns,
  caption = "Tabla de registros",          // Título oculto para lectores de pantalla
  searchPlaceholder = "Buscar...",
  emptyMessage = "No hay registros para mostrar",
  pageSizeOptions = [5, 10, 20, 50],
  initialPageSize = 5,
    initialSearch = "",                     // Texto inicial del buscador (ej. desde la URL)
}) {
  const pageSizeId = useId();
  const goToPageId = useId();

  // ================== ESTADO ==================
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState(initialSearch);

  // ================== CONFIGURACIÓN DE LA TABLA ==================
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1); // Nunca "Página 1 de 0"
  const currentPage = pagination.pageIndex + 1;
  const visibleColumns = table.getVisibleLeafColumns().length;

  // Lleva a la página escrita, limitada entre 1 y el total
  const goToPage = (value) => {
    if (value === "") return;
    const page = Math.min(Math.max(Number(value), 1), pageCount);
    table.setPageIndex(page - 1);
  };

  return (
    <div className="space-y-4">
      {/* ================== BARRA SUPERIOR ================== */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Buscador: filtra todas las columnas */}
        <Input
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Buscar en la tabla"
          className="sm:max-w-xs"
        />

        {/* Filas por página */}
        <div className="flex items-center gap-2">
          <label htmlFor={pageSizeId} className="text-small text-text-secondary">
            Filas por página
          </label>
          <div className="relative">
            <select
              id={pageSizeId}
              value={pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="
                h-12 cursor-pointer appearance-none rounded-sm border border-border
                bg-panel pl-4 pr-10 text-body text-text-primary transition-colors
                hover:border-border-strong
                focus:border-focus-border focus:outline-none focus:ring-1 focus:ring-focus-border
              "
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              size={20}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
          </div>
        </div>
      </div>

      {/* ================== TABLA ================== */}
      <div className="overflow-x-auto rounded-sm border border-border bg-panel">
        <table className="w-full text-text-primary">
          <caption className="sr-only">{caption}</caption>

          <thead className="bg-panel-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="h-12 border-b border-border px-4 text-left text-medium font-semibold text-text-primary"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 ? (
              // Estado vacío
              <tr>
                <td
                  colSpan={visibleColumns}
                  className="h-24 px-4 text-center text-medium text-text-secondary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border-soft transition-colors last:border-b-0 hover:bg-panel-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="h-12 px-4 py-2 text-medium">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================== PIE: CONTEO Y PAGINACIÓN ================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Se anuncia al filtrar o cambiar de página */}
        <p aria-live="polite" className="text-medium text-text-secondary">
          Mostrando {rows.length} de {totalRows} registros
        </p>

        <nav aria-label="Paginación" className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            Inicio
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          <span className="px-2 text-medium text-text-primary" aria-current="page">
            Página {currentPage} de {pageCount}
          </span>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            Final
          </Button>

          {/* Ir a página: se reinicia al cambiar de página (key) */}
          <div className="flex items-center gap-2 pl-2">
            <label htmlFor={goToPageId} className="text-small text-text-secondary">
              Ir a página
            </label>
            <input
              key={pagination.pageIndex}
              id={goToPageId}
              type="number"
              min={1}
              max={pageCount}
              defaultValue={currentPage}
              onChange={(e) => goToPage(e.target.value)}
              className="
                h-10 w-16 rounded-sm border border-border bg-panel px-2 text-center
                text-medium text-text-primary transition-colors
                hover:border-border-strong
                focus:border-focus-border focus:outline-none focus:ring-1 focus:ring-focus-border
              "
            />
          </div>
        </nav>
      </div>
    </div>
  );
}