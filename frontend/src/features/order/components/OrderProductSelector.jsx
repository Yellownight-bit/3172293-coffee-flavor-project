
import { useState } from "react";
import { API_URL } from "@/features/config";

const imageBaseUrl = API_URL.replace(/\/api\/?$/, "");

const getImageUrl = (image) => {
  const imagePath = Array.isArray(image) ? image[0] : image;

  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  if (
    imagePath.startsWith("http") ||
    imagePath.startsWith("data:image")
  ) {
    return imagePath;
  }

  return `${imageBaseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
};

export default function OrderProductSelector({
  products = [],
  dishes = [],
  onAddProduct,
  onQuantityChange,
  onRemoveProduct,
}) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const categories = [
    "Todos",
    ...new Set(
      products
        .map((product) => product.product_category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" ||
      product.product_category === selectedCategory;

    const matchesSearch = product.product_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getQuantity = (productId) => {
    const dish = dishes.find(
      (item) => String(item.productId) === String(productId)
    );

    return dish ? Number(dish.quantity) : 0;
  };

  const selectedProducts = dishes
    .map((dish) => ({
      ...dish,
      product: products.find(
        (product) => String(product.id) === String(dish.productId)
      ),
    }))
    .filter((dish) => dish.product);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-text-secondary uppercase text-sm mb-4">
          Seleccionar productos
        </h3>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full rounded-xl border border-border-soft bg-surface px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-focus-ring"
        />

        <div className="flex gap-2 overflow-x-auto pb-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-brand-strong text-white"
                  : "bg-surface text-text-secondary border border-border hover:bg-brand-subtle"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {filteredProducts.map((product) => {
              const quantity = getQuantity(product.id);
              const imageUrl = getImageUrl(product.product_image);

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.product_name}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="h-36 flex items-center justify-center bg-brand-subtle text-text-secondary">
                      Sin imagen
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase text-brand-strong">
                      {product.product_category || "Sin categoría"}
                    </p>

                    <h4 className="font-bold text-text-primary">
                      {product.product_name}
                    </h4>

                    <p className="font-semibold text-text-secondary">
                      {formatPrice(product.product_price)}
                    </p>

                    {product.product_description && (
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {product.product_description}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => onAddProduct(product.id)}
                      className="w-full rounded-xl bg-brand-strong text-white py-2 font-semibold hover:opacity-90 transition"
                    >
                      {quantity > 0
                        ? `Agregar otro (${quantity})`
                        : "+ Agregar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-text-secondary py-8">
            No se encontraron productos.
          </p>
        )}
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="font-bold text-text-secondary uppercase text-sm mb-4">
          Productos de la orden ({selectedProducts.length})
        </h3>

        {selectedProducts.length > 0 ? (
          <div className="space-y-3">
            {selectedProducts.map(({ product, productId, quantity }) => (
              <div
                key={productId}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border bg-surface p-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getImageUrl(product.product_image) ? (
                    <img
                      src={getImageUrl(product.product_image)}
                      alt={product.product_name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-brand-subtle flex items-center justify-center text-xs text-text-secondary">
                      Sin imagen
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">
                      {product.product_name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {formatPrice(product.product_price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onQuantityChange(productId, Number(quantity) - 1)
                      }
                      disabled={Number(quantity) <= 1}
                      className="h-8 w-8 rounded-full border border-border font-bold disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="min-w-5 text-center font-bold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        onQuantityChange(productId, Number(quantity) + 1)
                      }
                      className="h-8 w-8 rounded-full bg-brand-strong text-white font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveProduct(productId)}
                    title="Eliminar producto"
                    className="h-9 w-9 rounded-full bg-error-soft text-error hover:bg-error-soft-hover transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary text-center py-5">
            Todavía no has agregado productos a la orden.
          </p>
        )}
      </div>
    </div>
  );
}
