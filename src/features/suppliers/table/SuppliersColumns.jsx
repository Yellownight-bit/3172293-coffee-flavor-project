// src/features/users//tabl/SuppliersColumns.jsx

// Componente reutilizable que muestra un switch para activar o desactivar estados
import { StatusSwitch } from "@/shared";


// Componente que contiene los botones de acciones (editar y eliminar) para cada proveedor
import SupplierRowActions from "../components/SupplierRowActions";


// Definición de las columnas de la tabla de proveedores
// Este arreglo suele usarse en librerías de tablas como TanStack Table
export const suppliersColumns = [


  // Columna ID
  {
    accessorKey: "id", // Propiedad del objeto user que se mostrará en la columna
    header: "NIT",      // Título de la columna
  },


  // Columna Nombre
  {
    accessorKey: "companyName", // Campo del objeto proveedor
    header: "Compañia",    // Encabezado visible
  },


  // Columna Email
  {
    accessorKey: "supplierEmail",
    header: "Email",
  },


  // Columna Dirección
  {
    accessorKey: "supplierPhone",
    header: "Phone",
  },


  // Columna Estado (activo / inactivo)
  {
    accessorKey: "isActive",
    header: "Estado",


    // Render personalizado de la celda
    // Permite mostrar un componente en lugar de solo texto
    cell: ({ row }) => {


      // Se obtiene el objeto completo del usuario de la fila
      const supplier = row.original;


      // Función que se ejecuta cuando cambia el switch
      const handleChange = (value) => {


        // value representa el nuevo estado del switch (true o false)
        console.log("Actualizar estado proveedor:", supplier.id, value);


        // Aquí normalmente se llamaría una API para actualizar el estado
        // updateUserStatus(user.user_id, value)
      };


      return (
        // Componente reutilizable para mostrar el switch
        <StatusSwitch
          checked={supplier.isActive} // Estado actual del usuario
          onChange={handleChange}  // Función que maneja el cambio
        />
      );
    },
  },


  // Columna de acciones (editar / eliminar)
  {
    id: "actions", // No usa accessorKey porque no corresponde a un campo del usuario


    // Renderiza el componente de acciones pasando el usuario completo
    cell: ({ row }) => <SupplierRowActions supplier={row.original} />,
  },
];
