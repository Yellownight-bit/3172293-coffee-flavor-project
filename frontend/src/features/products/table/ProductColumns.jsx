
import ProductRowActions from "../components/ProductRowActions";
import { API_URL } from "@/features/config";

const imageBaseUrl = API_URL.replace(/\/api\/?$/, "");

export const productColumns = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "product_name",
        header: "Producto",
    },
    {
        accessorKey: "product_category",
        header: "Categoría",
    },
    {
        accessorKey: "product_price",
        header: "Precio",
        cell: ({ row }) => {
            const price = Number(row.original.product_price || 0);

            return new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
            }).format(price);
        },
    },
    {
        accessorKey: "product_description",
        header: "Descripción",
    },
    {
        accessorKey: "product_image",
        header: "Imagen",
        cell: ({ row }) => {
            const product = row.original;
            const image = product.product_image;

            const imageUrl = image
                ? image.startsWith("http") || image.startsWith("data:image")
                    ? image
                    : `${imageBaseUrl}${image.startsWith("/") ? "" : "/"}${image}`
                : null;

            return imageUrl ? (
                <img
                    src={imageUrl}
                    alt={product.product_name}
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
        cell: ({ row }) => (
            <ProductRowActions product={row.original} />
        ),
    },
];
