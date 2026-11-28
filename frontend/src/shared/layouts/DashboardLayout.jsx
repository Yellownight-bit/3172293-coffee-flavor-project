// Layout del panel
// - Enlace "Saltar al contenido" (visible solo al usar Tab).
// - Navbar fuera de <main> para separar las zonas de la página.
// - Imagen de fondo que se oscurece en tema oscuro (bg-image-themed).
import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared";
import restaurant from "@/assets/images/restaurant.jpg";

export default function DashboardLayout() {
  return (
    <div
      className="min-h-screen w-full bg-image-themed"
      style={{
        backgroundImage: `url(${restaurant})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <a
        href="#contenido"
        className="
          sr-only
          focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]
          focus:rounded-full focus:bg-panel focus:px-4 focus:py-3
          focus:text-medium focus:text-text-primary focus:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-focus-ring
        "
      >
        Saltar al contenido
      </a>

      <Navbar />

      <main id="contenido" tabIndex={-1} className="mx-auto focus:outline-none">
        <Outlet />
      </main>
    </div>
  );
}