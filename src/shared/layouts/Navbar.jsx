import { useState } from "react";
import { Menu } from "lucide-react";
import {
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  SearchField,
} from "@/shared";
import  logo  from "@/assets/images/1-logo.png";
import { Link } from "react-router-dom";


export default function Navbar(){


// Componente de búsqueda 😂
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
            <div className=" hidden sm:block items-center">
                <Link to={"/dashboard/"} className="text-h1 font-heading">
                <img src={logo} alt="logo" className="h-12" />
                </Link>
            </div>


            {/* Links de navegación */}
            <ul className="hidden md:flex items-center gap-6">
                <li>
                <Link to={"/auth"} className="hover:text-primary transition">
                    Inicio
                </Link>
                </li>
                <li>
                <Link
                    to={"/dashboard"}
                    className="hover:text-primary transition"
                >
                    Cursos
                </Link>
                </li>
                <li>
                <Link to={"/inicio"} className="hover:text-primary transition">
                    Multimedia
                </Link>
                </li>
                <li>
                <Link to={"/inicio"} className="hover:text-primary transition">
                    Contacto
                </Link>
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
                <Dropdown className="z-50">
                        <DropdownTrigger>
                            <IconButton ariaLabel="Menú de usuario">
                                <Menu />
                            </IconButton>
                        </DropdownTrigger>

                        {/*Contenido*/}
                        <DropdownContent>
                            <DropdownItem>
                                <Link to="/dashboard/userList" className="block w-full">Usuarios</Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to="/dashboard/productList" className="block w-full">Productos</Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to="inventoryList" className="block w-full">Inventario</Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to="supplierList" className="block w-full">Proveedores</Link>
                            </DropdownItem>
                             <DropdownItem>
                                <Link to="/auth" className="block w-full">Cerrar sesión</Link>
                            </DropdownItem>
                        </DropdownContent>
                    </Dropdown>
                {/* <IconButton /> */}
            </div>
        </div>
    </nav>
  );
}
