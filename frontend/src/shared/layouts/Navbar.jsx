
import { useEffect, useState } from "react";
import {
  Menu,
  House,
  Users,
  KeyRound,
  Utensils,
  GraduationCap,
  Image,
  Package,
  Boxes,
  Truck,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
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
import { Link, useNavigate } from "react-router-dom";
import { showOpsAlert } from "@/shared/services/alertservice";
import useTheme from "@/shared/context/useTheme";
import { logout } from "@/features/auth/services/logoutService";
import { getMyProfile } from "@/features/users/services/userServices.js";
import { API_URL } from "@/features/config";

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

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) return image;

    const serverUrl = API_URL.replace(/\/api\/?$/, "");

    return `${serverUrl}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const profileImage = getImageUrl(profile?.user_image);

  const initials = profile?.user_name
    ?.trim()
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const handleSearch = (value) => {
    console.log("Buscar:", value);
  };

  const handleClear = () => {
    console.log("Campo limpiado");
  };

  return (
    <nav className="w-full border-b-2 border-transparent bg-surface-alt text-text-primary dark:border-border">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo de marca */}
          <div className="hidden sm:block items-center">
            <Link to={"/HomePage"} className="text-h1 font-heading">
              <img src={logo} alt="logo" className="h-12" />
            </Link>
          </div>

          {/* Links de navegación */}
          <ul className="hidden md:flex items-center gap-6">

            <li>
              <Link
                to={"/HomePage"}
                className="hover:text-on-brand dark:hover:text-brand-strong transition flex items-center gap-1.5"
              >
                <House size={17} />
                Inicio
              </Link>
            </li>

            <li>
              <Link
                to={"/dashboard/userList"}
                className="hover:text-on-brand dark:hover:text-brand-strong transition flex items-center gap-1.5"
              >
                <Users size={17} />
                Usuarios
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard/access"
                className="hover:text-on-brand dark:hover:text-brand-strong transition flex items-center gap-1.5"
              >
                <KeyRound size={17} />
                Permisos
              </Link>
            </li>

            <li>
              <Link
                to={"/dashboard/readMenu"}
                className="hover:text-on-brand dark:hover:text-brand-strong transition flex items-center gap-1.5"
              >
                <Utensils size={17} />
                Menu
              </Link>
            </li>

            <li
              onClick={() =>
                showOpsAlert({
                  title: "Ops, hubo un error",
                  text: "Esta opción no está disponible en este momento.",
                })
              }
              className="cursor-pointer hover:text-on-brand dark:hover:text-brand-strong transition flex items-center gap-1.5"
            >
              <GraduationCap size={17} />
              Cursos
            </li>

            <li
              onClick={() =>
                showOpsAlert({
                  title: "Ops, hubo un error",
                  text: "Esta opción no está disponible en este momento.",
                })
              }
              className="cursor-pointer hover:text-on-brand dark:hover:text-brand-strong transition flex items-center gap-1.5"
            >
              <Image size={17} />
              Multimedia
            </li>

          </ul>

          {/* Buscador */}
          <div>
            <SearchField
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
              onClear={handleClear}
              placeholder="Buscar productos..."
              size="md"
              variant="outlined"
              className="w-76"
            />
          </div>

          {/* Menú hamburguesa */}
          <Dropdown className="z-50">
            <DropdownTrigger>
              <IconButton ariaLabel="Menú de usuario">
                <Menu />
              </IconButton>
            </DropdownTrigger>

            <DropdownContent className="border-2 border-brand">

              <DropdownItem>
                <Link
                  to="/dashboard/userList"
                  className="flex items-center gap-2 w-full"
                >
                  <Users size={17} />
                  Usuarios
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="/dashboard/productList"
                  className="flex items-center gap-2 w-full"
                >
                  <Package size={17} />
                  Productos
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="/dashboard/inventoryList"
                  className="flex items-center gap-2 w-full"
                >
                  <Boxes size={17} />
                  Inventario
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="/dashboard/supplierList"
                  className="flex items-center gap-2 w-full"
                >
                  <Truck size={17} />
                  Proveedores
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="/dashboard/orderList"
                  className="flex items-center gap-2 w-full"
                >
                  <ClipboardList size={17} />
                  Ordenes
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="/dashboard/access"
                  className="flex items-center gap-2 w-full"
                >
                  <ShieldCheck size={17} />
                  Gestión permisos
                </Link>
              </DropdownItem>

              {/* Cambiar tema */}
              <DropdownItem
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === "light" ? (
                  <>
                    <Moon size={17} />
                    Modo oscuro
                  </>
                ) : (
                  <>
                    <Sun size={17} />
                    Modo claro
                  </>
                )}
              </DropdownItem>

              {/* Cerrar sesión */}
              <DropdownItem>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <LogOut size={17} />
                  Cerrar sesión
                </button>
              </DropdownItem>

            </DropdownContent>
          </Dropdown>

          {/* Mi perfil */}
          <Link
            to="/dashboard/myProfile"
            aria-label="Mi perfil"
            title="Mi perfil"
            className="
              w-12 h-12
              shrink-0
              rounded-full
              border border-gray-400
              overflow-hidden
              flex items-center justify-center
              hover:border-brand
              transition-colors duration-200
            "
          >
            {profileImage && !imageError ? (
              <img
                src={profileImage}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-sm font-bold text-text-secondary uppercase">
                {initials || "👤"}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}
