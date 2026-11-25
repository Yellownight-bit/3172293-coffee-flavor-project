
import InventoryRowActions from "../components/InventoryRowActions";
import { API_URL } from "@/features/config";

const imageBaseUrl = API_URL.replace(/\/api\/?$/, "");

export const inventoryColumns = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "product_name",
        header: "Producto",
    },
    
    {
        accessorKey: "product_id",
        header: "ID del producto",
    },
    {
        accessorKey: "product_quantity",
        header: "Stock actual",
        cell: ({ row }) => {
            const quantity = Number(row.original.product_quantity || 0);

            return (
                <span className={quantity <= 5 ? "text-error font-semibold" : ""}>
                    {quantity}
                    {quantity <= 5 && " (bajo)"}
                </span>
            );
        },
    },
    {
        accessorKey: "product_price",
        header: "Precio",
        cell: ({ row }) => {
            return new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
            }).format(Number(row.original.product_price || 0));
        },
    },
    {
        accessorKey: "product_supplier_names",
        header: "Proveedor",
        cell: ({ row }) => row.original.product_supplier_names || "Sin proveedor",
    },
    {
        accessorKey: "product_entry_date",
        header: "Fecha de entrada",
        cell: ({ row }) => {
            const date = row.original.product_entry_date;

            if (!date) return "Sin fecha";

            const parsedDate = new Date(date);

            if (isNaN(parsedDate.getTime())) return "Sin fecha";

            return parsedDate.toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "UTC",
            });
        },
    },
    {
        accessorKey: "product_image",
        header: "Imagen",
        cell: ({ row }) => {
            const inventory = row.original;
            const image = inventory.product_image;

            const imageUrl = image
                ? image.startsWith("http") || image.startsWith("data:image")
                    ? image
                    : `${imageBaseUrl}${image.startsWith("/") ? "" : "/"}${image}`
                : null;

            return imageUrl ? (
                <img
                    src={imageUrl}
                    alt={inventory.product_name}
                    className="h-10 w-10 rounded object-cover"
                />
            ) : (
                <span className="text-sm text-text-muted">
                    Sin imagen
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <InventoryRowActions item={row.original} />,
    },
    
];
