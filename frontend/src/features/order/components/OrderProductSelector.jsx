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

/* ------------------------------------------------------------------ */
/* Modos de vista                                                      */
/* ------------------------------------------------------------------ */

const VIEW_MODE_STORAGE_KEY = "orderProductViewMode";

const VIEW_MODES = [
  { id: "list", label: "Lista" },
  { id: "small", label: "Pequeños" },
  { id: "medium", label: "Medianos" },
  { id: "large", label: "Grandes" },
];

const VIEW_STYLES = {
  list: {
    grid: "grid grid-cols-1 gap-2",
    card: "flex flex-row items-center gap-3 p-2",
    image: "h-16 w-16 shrink-0 rounded-xl",
    content: "flex-1 min-w-0",
    name: "font-bold text-sm text-text-primary truncate",
    price: "text-sm font-semibold text-text-secondary",
    button: "shrink-0 rounded-xl px-4 py-2 text-sm",
    stepper: "shrink-0 gap-3 rounded-xl p-1",
    stepButton: "h-8 w-8 text-lg",
    showCategory: true,
    descriptionClamp: "",
  },
  small: {
    grid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3",
    card: "flex flex-col",
    image: "h-20 w-full",
    content: "p-2 space-y-1 flex-1 flex flex-col",
    name: "font-bold text-sm text-text-primary truncate",
    price: "text-xs font-semibold text-text-secondary",
    button: "w-full rounded-lg py-1.5 text-xs mt-auto",
    stepper: "w-full rounded-lg p-1 mt-auto",
    stepButton: "h-6 w-6 text-base",
    showCategory: false,
    descriptionClamp: "",
  },
  medium: {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    card: "flex flex-col",
    image: "h-36 w-full",
    content: "p-4 space-y-2 flex-1 flex flex-col",
    name: "font-bold text-text-primary",
    price: "font-semibold text-text-secondary",
    button: "w-full rounded-xl py-2 mt-auto",
    stepper: "w-full rounded-xl p-1 mt-auto",
    stepButton: "h-8 w-8 text-lg",
    showCategory: true,
    descriptionClamp: "line-clamp-2",
  },
  large: {
    grid: "grid grid-cols-1 sm:grid-cols-2 gap-5",
    card: "flex flex-col",
    image: "h-56 w-full",
    content: "p-5 space-y-3 flex-1 flex flex-col",
    name: "font-bold text-lg text-text-primary",
    price: "text-lg font-semibold text-text-secondary",
    button: "w-full rounded-xl py-3 text-base mt-auto",
    stepper: "w-full rounded-xl p-1.5 mt-auto",
    stepButton: "h-9 w-9 text-xl",
    showCategory: true,
    descriptionClamp: "line-clamp-3",
  },
};

const getInitialViewMode = () => {
  try {
    const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return VIEW_STYLES[saved] ? saved : "medium";
  } catch {
    // localStorage no disponible: se usa la vista por defecto
    return "medium";
  }
};

// Íconos simples dibujados en SVG (sin dependencias)
function ViewIcon({ type }) {
  const columns = { small: 3, medium: 2, large: 1 }[type];

  if (!columns) {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <rect x="2" y="3" width="16" height="3" rx="1" />
        <rect x="2" y="8.5" width="16" height="3" rx="1" />
        <rect x="2" y="14" width="16" height="3" rx="1" />
      </svg>
    );
  }

  const gap = 2;
  const size = (16 - gap * (columns - 1)) / columns;
  const cells = [];

  for (let row = 0; row < columns; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={2 + col * (size + gap)}
          y={2 + row * (size + gap)}
          width={size}
          height={size}
          rx="1"
        />
      );
    }
  }

  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      {cells}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tarjeta de producto                                                 */
/* ------------------------------------------------------------------ */

function ProductCard({
  product,
  quantity,
  mode,
  onAdd,
  onQuantityChange,
  onRemove,
}) {
  const styles = VIEW_STYLES[mode];
  const imageUrl = getImageUrl(product.product_image);
  const isList = mode === "list";

  // Al bajar de 1 a 0 se quita el producto de la orden y vuelve "+ Agregar"
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(product.id, quantity - 1);
    } else {
      onRemove(product.id);
    }
  };

  const addButton =
    quantity > 0 ? (
      <div
        role="group"
        aria-label={`Cantidad de ${product.product_name}`}
        className={`flex items-center justify-between bg-brand-strong text-white ${styles.stepper}`}
      >
        <button
          type="button"
          onClick={handleDecrease}
          aria-label={`Quitar una unidad de ${product.product_name}`}
          className={`flex items-center justify-center rounded-full bg-white font-bold leading-none text-brand-strong transition hover:opacity-90 ${styles.stepButton}`}
        >
          −
        </button>

        <span className="min-w-6 text-center font-bold">{quantity}</span>

        <button
          type="button"
          onClick={() => onAdd(product.id)}
          aria-label={`Agregar una unidad de ${product.product_name}`}
          className={`flex items-center justify-center rounded-full bg-white font-bold leading-none text-brand-strong transition hover:opacity-90 ${styles.stepButton}`}
        >
          +
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => onAdd(product.id)}
        className={`bg-brand-strong text-white font-semibold hover:opacity-90 transition ${styles.button}`}
      >
        + Agregar
      </button>
    );

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-surface shadow-sm ${styles.card}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.product_name}
          className={`object-cover ${styles.image}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center bg-brand-subtle text-xs text-text-secondary ${styles.image}`}
        >
          Sin imagen
        </div>
      )}

      <div className={styles.content}>
        {styles.showCategory && (
          <p className="text-xs font-semibold uppercase text-brand-strong truncate">
            {product.product_category || "Sin categoría"}
          </p>
        )}

        <h4 className={styles.name} title={product.product_name}>
          {product.product_name}
        </h4>

        <p className={styles.price}>{formatPrice(product.product_price)}</p>

        {styles.descriptionClamp && product.product_description && (
          <p className={`text-sm text-text-secondary ${styles.descriptionClamp}`}>
            {product.product_description}
          </p>
        )}

        {!isList && addButton}
      </div>

      {isList && addButton}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export default function OrderProductSelector({
  products = [],
  dishes = [],
  onAddProduct,
  onQuantityChange,
  onRemoveProduct,
}) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(getInitialViewMode);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);

    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // Si no se puede guardar, la vista solo cambia en esta sesión
    }
  };

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

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="min-w-0 flex-1 rounded-xl border border-border-soft bg-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />

          <div
            role="group"
            aria-label="Tamaño de los productos"
            className="flex shrink-0 gap-1 rounded-xl border border-border bg-surface p-1"
          >
            {VIEW_MODES.map((mode) => {
              const isActive = viewMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  title={mode.label}
                  aria-pressed={isActive}
                  onClick={() => handleViewModeChange(mode.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-brand-strong text-white"
                      : "text-text-secondary hover:bg-brand-subtle"
                  }`}
                >
                  <ViewIcon type={mode.id} />
                  <span className="hidden md:inline">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

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
          <div className={`mt-3 ${VIEW_STYLES[viewMode].grid}`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getQuantity(product.id)}
                mode={viewMode}
                onAdd={onAddProduct}
                onQuantityChange={onQuantityChange}
                onRemove={onRemoveProduct}
              />
            ))}
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
                  <span className="rounded-full bg-brand-subtle px-3 py-1 text-sm font-bold text-text-primary">
                    x{quantity}
                  </span>

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