import { StatusSwitch } from "@/shared";
import UserRowActions from "../components/UserRowActions";

export const UserColumns = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "user_name",
    header: "Nombre",
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
      const user = row.original;

      const handleChange = (value) => {
        console.log("Actualizar estado usuario:", user.id, value);
      };

      return (
        <StatusSwitch
          checked={user.is_active}
          onChange={handleChange}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];