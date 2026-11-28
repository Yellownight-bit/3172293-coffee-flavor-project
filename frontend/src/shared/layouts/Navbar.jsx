// Componente Navbar

import { useEffect, useState } from "react";
import {
  Menu,
  House,
  KeyRound,
  Utensils,
  Image,
  Users,
  Package,
  Boxes,
  Truck,
  ClipboardList,
  LogOut,
  Sun,
  Moon,
  User,
} from "lucide-react";

import {
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  SearchField,
} from "@/shared";

import logo from "@/assets/images/1-logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  showOpsAlert,
  showConfirmLogoutAlert,
} from "@/shared/services/alertService";
import useTheme from "@/shared/context/useTheme";
import { logout } from "@/features/auth/services/logoutService";
import { getMyProfile } from "@/features/users/services/userServices.js";
import { API_URL } from "@/features/config";

// Enlaces principales (barra en escritorio, menú en móvil)
const NAV_LINKS = [
  { to: "/HomePage", label: "Inicio", icon: House },
  { to: "/dashboard/access", label: "Permisos", icon: KeyRound },
  { to: "/dashboard/readMenu", label: "Menú", icon: Utensils },
];

// Enlaces del menú desplegable
const MENU_LINKS = [
  { to: "/dashboard/userList", label: "Usuarios", icon: Users },
  { to: "/dashboard/productList", label: "Productos", icon: Package },
  { to: "/dashboard/inventoryList", label: "Inventario", icon: Boxes },
  { to: "/dashboard/supplierList", label: "Proveedores", icon: Truck },
  { to: "/dashboard/orderList", label: "Órdenes", icon: ClipboardList },
];

// Arma la URL completa de la foto guardada en el backend
const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  const serverUrl = API_URL.replace(/\/api\/?$/, "");
  return `${serverUrl}${image.startsWith("/") ? image : `/${image}`}`;
};

// Iniciales: primera letra de las dos primeras palabras ("Jacobo Agudelo" → "JA")
const getInitials = (name) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

// Estilo de los enlaces de la barra (resalta la página actual)
const navLinkClass = ({ isActive }) => `
  flex min-h-12 items-center gap-2 rounded-full px-3 text-medium transition-colors
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
  [&_svg]:size-5 [&_svg]:shrink-0
  ${isActive
    ? "bg-brand-soft font-semibold text-text-primary"
    : "text-text-primary hover:bg-panel-muted"}
`;

const showUnavailable = () =>
  showOpsAlert({
    title: "Ops, hubo un error",
    text: "Esta opción no está disponible en este momento.",
  });

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(null);
  const [imageError, setImageError] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getMyProfile();
        setProfile(userData);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };

    loadProfile();
  }, []);

  const profileImage = getImageUrl(profile?.user_image);
  const initials = getInitials(profile?.user_name);

  // Cerrar sesión (lógica de auth: sin cambios)
  const handleLogout = async () => {
    const result = await showConfirmLogoutAlert();

    if (result.isConfirmed) {
      logout();
      navigate("/auth", { replace: true });
    }
  };

  // Buscar: lleva a la lista de productos filtrada
  const handleSearch = (value) => {
    const term = value.trim();
    navigate(
      term
        ? `/dashboard/productList?buscar=${encodeURIComponent(term)}`
        : "/dashboard/productList"
    );
  };

  return (
    <nav
      aria-label="Navegación principal"
      className="w-full border-b border-border-soft bg-surface-alt text-text-primary"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo de marca */}
        <Link
          to="/HomePage"
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <img src={logo} alt="Coffee Flavor - Inicio" className="h-10 sm:h-12" />
        </Link>

        {/* Enlaces principales (escritorio) */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} className={navLinkClass}>
                <Icon aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}

          <li>
            <button
              type="button"
              onClick={showUnavailable}
              className={navLinkClass({ isActive: false })}
            >
              <Image aria-hidden="true" />
              Multimedia
            </button>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          {/* Buscador */}
          <SearchField
            value={search}
            onChange={setSearch}
            onSubmit={handleSearch}
            placeholder="Buscar productos..."
            size="md"
            variant="outlined"
            className="hidden w-56 sm:flex lg:w-72"
          />

          {/* Menú */}
          <Dropdown>
            <DropdownTrigger>
              <IconButton ariaLabel="Menú de usuario">
                <Menu />
              </IconButton>
            </DropdownTrigger>

            <DropdownContent>
              {/* En móvil: enlaces principales */}
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <DropdownItem key={`m-${to}`} to={to} className="md:hidden">
                  <Icon aria-hidden="true" />
                  {label}
                </DropdownItem>
              ))}
              <DropdownItem onClick={showUnavailable} className="md:hidden">
                <Image aria-hidden="true" />
                Multimedia
              </DropdownItem>

              {MENU_LINKS.map(({ to, label, icon: Icon }) => (
                <DropdownItem key={to} to={to}>
                  <Icon aria-hidden="true" />
                  {label}
                </DropdownItem>
              ))}

              {/* Cambiar tema */}
              <DropdownItem onClick={toggleTheme} className="mt-2 border-t border-border-soft pt-2">
                {theme === "light" ? (
                  <>
                    <Moon aria-hidden="true" />
                    Modo oscuro
                  </>
                ) : (
                  <>
                    <Sun aria-hidden="true" />
                    Modo claro
                  </>
                )}
              </DropdownItem>

              {/* Cerrar sesión */}
              <DropdownItem onClick={handleLogout}>
                <LogOut aria-hidden="true" />
                Cerrar sesión
              </DropdownItem>
            </DropdownContent>
          </Dropdown>

          {/* Mi perfil */}
          <Link
            to="/dashboard/myProfile"
            aria-label="Mi perfil"
            title="Mi perfil"
            className="
              flex size-12 shrink-0 items-center justify-center overflow-hidden
              rounded-full border border-border bg-panel
              transition-colors hover:border-brand
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
            "
          >
            {profileImage && !imageError ? (
              <img
                src={profileImage}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : initials ? (
              <span className="text-medium font-semibold text-text-secondary">
                {initials}
              </span>
            ) : (
              <User aria-hidden="true" className="size-6 text-text-secondary" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}