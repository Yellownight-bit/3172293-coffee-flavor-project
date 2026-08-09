import OrderRowActions from "../components/OrderRowActions";

export const orderColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "tableNumber",
    header: "Mesa",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "waiter",
    header: "Mesero",
  },
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    accessorKey: "total",
    header: "Valor total",
    cell: ({ row }) => {
      const value = row.original.total;

      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <OrderRowActions row={row} />,
  },
];