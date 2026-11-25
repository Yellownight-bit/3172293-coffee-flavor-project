
import { StatusSwitch } from "@/shared";
import SupplierRowActions from "../components/SupplierRowActions";

export const suppliersColumns = (
  handleStatusChange,
  canDisableSupplier
) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "supplier_name",
    header: "Compañía",
  },
  {
    accessorKey: "supplier_document_number",
    header: "NIT",
  },
  {
    accessorKey: "supplier_email",
    header: "Email",
  },
  {
    accessorKey: "supplier_phone",
    header: "Teléfono",
  },
  {
    accessorKey: "supplier_address",
    header: "Dirección",
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <StatusSwitch
          checked={supplier.is_active}
          onChange={(value) =>
            handleStatusChange(supplier.id, value)
          }
          disabled={!canDisableSupplier}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <SupplierRowActions supplier={row.original} />
    ),
  },
];
