
import { StatusSwitch } from "@/shared";
import UserRowActions from "../components/UserRowActions";

export const UserColumns = (handleStatusChange, canDisableUser) => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "user_name",
    header: "Nombre",
  },
  {
    accessorKey: "rol",
    header: "Rol",
  },
  {
    accessorKey: "user_email",
    header: "Email",
  },
  {
    accessorKey: "user_phone",
    header: "Teléfono",
  },
  {
    accessorKey: "user_document_types",
    header: "Tipo de documento",
  },
  {
    accessorKey: "user_document_number",
    header: "Número de documento",
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      return (
        <StatusSwitch
          checked={row.original.is_active}
          disabled={!canDisableUser}
          onChange={(value) =>
            handleStatusChange(row.original.id, value)
          }
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];
