import { useState } from "react";
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
import { Link } from "react-router-dom";
import { showOpsAlert } from "@/shared/services/alertservice";

export default function Navbar() {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    console.log("Buscar:", value);
  };

  const handleClear = () => {
    console.log("Campo limpiado");
  };

  return (
    <nav className="w-full bg-[var(--color-primary-950)] border-b-2">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo de marca */}
          <div className="hidden sm:block items-center">
            <Link to={"/"} className="text-h1 font-heading">
              <img src={logo} alt="logo" className="h-12" />
            </Link>
          </div>

          {/* Links de navegación */}
          <ul className="hidden md:flex items-center gap-6">

            <li>
              <Link
                to={"/"}
                className="hover:text-primary transition flex items-center gap-1.5"
              >
                <House size={17} />
                Inicio
              </Link>
            </li>

            <li>
              <Link
                to={"/dashboard/userList"}
                className="hover:text-primary transition flex items-center gap-1.5"
              >
                <Users size={17} />
                Usuarios
              </Link>
            </li>

            <li>
              <Link
                to={"/Permissions"}
                className="hover:text-primary transition flex items-center gap-1.5"
              >
                <KeyRound size={17} />
                Permisos
              </Link>
            </li>

            <li>
              <Link
                to={"/dashboard/readMenu"}
                className="hover:text-primary transition flex items-center gap-1.5"
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
              className="cursor-pointer flex items-center gap-1.5"
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
              className="cursor-pointer flex items-center gap-1.5"
            >
              <Image size={17} />
              Multimedia
            </li>

          </ul>

          {/* SearchField */}
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

          {/* Dropdown */}
          <Dropdown className="z-50">
            <DropdownTrigger>
              <IconButton ariaLabel="Menú de usuario">
                <Menu />
              </IconButton>
            </DropdownTrigger>

            {/* Contenido */}
            <DropdownContent className="border-2 border-orange-400">

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
                  to="inventoryList"
                  className="flex items-center gap-2 w-full"
                >
                  <Boxes size={17} />
                  Inventario
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="supplierList"
                  className="flex items-center gap-2 w-full"
                >
                  <Truck size={17} />
                  Proveedores
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="orderList"
                  className="flex items-center gap-2 w-full"
                >
                  <ClipboardList size={17} />
                  Ordenes
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="/Permissions"
                  className="flex items-center gap-2 w-full"
                >
                  <ShieldCheck size={17} />
                  Gestión permisos
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link
                  to="/auth"
                  className="flex items-center gap-2 w-full"
                >
                  <LogOut size={17} />
                  Cerrar sesión
                </Link>
              </DropdownItem>

            </DropdownContent>
          </Dropdown>

        </div>
      </div>
    </nav>
  );
}