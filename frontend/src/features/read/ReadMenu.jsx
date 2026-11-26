
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UtensilsCrossed,
  Coffee,
  ImageOff,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/shared";
import { API_URL } from "@/features/config";
import { getAllProducts } from "@/features/products/services/productServices";

const imageBaseUrl = API_URL.replace(/\/api\/?$/, "");

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
};

const getImageUrl = (image) => {
  if (!image) return null;

  if (
    image.startsWith("http") ||
    image.startsWith("data:image")
  ) {
    return image;
  }

  return `${imageBaseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
};

const isProductActive = (product) => {
  if (product.activo === undefined || product.activo === null) {
    return true;
  }

  return (
    product.activo === true ||
    product.activo === 1 ||
    product.activo === "1" ||
    product.activo === "true"
  );
};

export default function ReadMenu() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllProducts();

      const productList = Array.isArray(data)
        ? data
        : data.products || [];

      setProducts(productList.filter(isProductActive));
    } catch (error) {
      setError(error.message || "No fue posible cargar el menú.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.product_category)
          .filter(Boolean)
      ),
    ];

    return [
      "Todos",
      ...uniqueCategories.sort((a, b) =>
        a.localeCompare(b, "es")
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Todos" ||
        product.product_category === selectedCategory;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        product.product_name?.toLowerCase().includes(searchText) ||
        product.product_description?.toLowerCase().includes(searchText) ||
        product.product_category?.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* Encabezado */}
      <header className="bg-panel border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">

          <div className="flex items-center justify-between gap-6">

            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-strong text-white shrink-0">
                <Coffee size={27} />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-text-primary">
                  COFFEE FLAVOR
                </h1>

                <p className="text-xs sm:text-sm text-text-muted">
                  Sabores que hacen la diferencia
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                variant="back"
                size="back"
                type="button"
                onClick={() => navigate("/HomePage")}
              >
                <ArrowLeft size={17} className="mr-2" />
                Atrás
              </Button>
            </div>

          </div>

        </div>
      </header>

      {/* Presentación */}
      <section className="bg-panel-muted">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 text-center">

          <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-strong mb-4">
            <UtensilsCrossed size={17} />
            NUESTRO MENÚ
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-text-primary tracking-tight">
            Descubre nuestros sabores
          </h2>

          <p className="max-w-2xl mx-auto mt-4 text-text-secondary text-sm sm:text-base leading-relaxed">
            Explora nuestra selección de productos y encuentra
            tu próxima experiencia favorita en Coffee Flavor.
          </p>

        </div>
      </section>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-12">

        {/* Buscador y categorías */}
        <div className="flex flex-col gap-6 mb-9">

          <div className="relative w-full max-w-xl mx-auto">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar un producto..."
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-panel text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand-strong focus:border-transparent transition"
            />
          </div>

          {!loading && !error && categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2">

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "bg-brand-strong text-white shadow-md"
                      : "bg-panel border border-border text-text-secondary hover:border-brand-strong hover:text-brand-strong"
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>
          )}

        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-brand-strong border-t-transparent rounded-full animate-spin" />

            <p className="mt-5 text-text-secondary font-medium">
              Cargando nuestro menú...
            </p>
          </div>
        )}

        {/* Estado de error */}
        {!loading && error && (
          <div className="max-w-lg mx-auto text-center py-16 px-6 bg-panel rounded-2xl border border-border">

            <p className="text-lg font-bold text-text-primary">
              No pudimos cargar el menú
            </p>

            <p className="text-sm text-text-muted mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-strong text-white font-semibold hover:opacity-90 transition"
            >
              <RefreshCw size={17} />
              Intentar nuevamente
            </button>

          </div>
        )}

        {/* Menú vacío */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <UtensilsCrossed
              size={48}
              className="mx-auto text-text-muted"
            />

            <h3 className="text-xl font-bold text-text-primary mt-5">
              Nuestro menú está en preparación
            </h3>

            <p className="text-text-muted mt-2">
              Actualmente no hay productos activos disponibles.
            </p>
          </div>
        )}

        {/* Sin resultados de búsqueda */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <Search
                size={45}
                className="mx-auto text-text-muted"
              />

              <h3 className="text-xl font-bold text-text-primary mt-5">
                No encontramos productos
              </h3>

              <p className="text-text-muted mt-2">
                Intenta con otro nombre o selecciona una categoría diferente.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Todos");
                }}
                className="mt-5 text-brand-strong font-semibold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

        {/* Tarjetas de productos */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-xl font-bold text-text-primary">
                Nuestros productos
              </h3>

              <span className="text-sm text-text-muted">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "producto"
                  : "productos"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {filteredProducts.map((product) => {
                const imageUrl = getImageUrl(product.product_image);

                return (
                  <article
                    key={product.id}
                    className="group bg-panel rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >

                    {/* Imagen */}
                    <div className="relative h-56 bg-panel-muted flex items-center justify-center overflow-hidden">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.product_name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-text-muted">
                          <ImageOff size={42} />
                          <span className="text-sm">
                            Imagen no disponible
                          </span>
                        </div>
                      )}

                      {product.product_category && (
                        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-panel/95 text-brand-strong text-xs font-bold shadow-sm">
                          {product.product_category}
                        </span>
                      )}

                    </div>

                    {/* Información */}
                    <div className="p-5">

                      <h4 className="text-lg font-bold text-text-primary line-clamp-1">
                        {product.product_name}
                      </h4>

                      <p className="text-sm text-text-muted mt-2 leading-relaxed min-h-12 line-clamp-2">
                        {product.product_description ||
                          "Un producto preparado para disfrutar en Coffee Flavor."}
                      </p>

                      <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-border">

                        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          Precio
                        </span>

                        <span className="text-xl font-bold text-brand-strong">
                          {formatPrice(product.product_price)}
                        </span>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          </>
        )}

      </main>

      {/* Pie de página */}
      <footer className="mt-10 bg-panel border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-7 text-center">

          <p className="font-bold tracking-wider text-text-primary">
            COFFEE FLAVOR
          </p>

          <p className="text-sm text-text-muted mt-2">
            Gracias por elegirnos. ¡Esperamos que disfrutes cada sabor!
          </p>

        </div>
      </footer>

    </div>
  );
}
