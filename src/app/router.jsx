import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import CreateUser  from "@/features/create/CreateUser";
import CreateSupplier from "@/features/create/CreateSupplier"
import CreateInventory from "@/features/create/CreateInventory"
import CreateMenu from "@/features/create/CreateMenu"
import { UserRegisterForm } from "../features/users";
import { UserListPage } from "@/features/users";
import { InventoryListPage } from "@/features/inventory";
import { HomePage } from "@/features/home"
import { SupplierListPage } from "@/features/suppliers";
import { ProductListPage } from "../features/products";

import ReadUser from "@/features/read/ReadUser"
import ReadSupplier from "@/features/read/ReadSupplier"
import ReadMenu from "@/features/read/ReadMenu"
import ReadUserDavid from "@/features/read/users/ReadUserDavid"

import UpdateUser from "@/features/update/users/UpdateUser"
// import PermitManagement from "@/features/permissions/components/PermitManagement"
import UpdateSupplier from "@/features/update/suppliers/UpdateSupplier"

import ReadUserDilan from "@/features/read/users/ReadUserDilan"
import ReadUserNicolas from "@/features/read/users/ReadUserNicolas"
import ReadUserMaycol from "@/features/read/users/ReadUserMaycol"
import { PermissionManagement } from "../features/permissions";
import Supplier1 from "@/features/read/suppliers/Supplier1"
import Supplier2 from "@/features/read/suppliers/Supplier2"
import Supplier3 from "@/features/read/suppliers/Supplier3"
import Supplier4 from "@/features/read/suppliers/Supplier4"
import CaféAme from "@/features/read/menu/CaféAme"
import Capucchino from "@/features/read/menu/Capucchino"
import Croissant from "@/features/read/menu/Croissant"
import TortaChocolate from "@/features/read/menu/TortaChocolate"

const router = createBrowserRouter ([ 
    {
    path: "/",
    element: <HomePage to="/dashboard" replace />
    },
    {
    path: "/auth",
    element: <AuthLayout />,
    children: [
            {
            index: true,
            },
        ],
    },
    {
    path: "/dashboard",
    element: <DashboardLayout/>,
    children: [
            { index: true},
            // { path: "/dashboard/auth", element: <h1>Hello2</h1> },
            { path: "/dashboard/userList", element: <UserListPage/> },
            { path: "/dashboard/userCreate", element: <UserRegisterForm/> },
            { path: "inventoryList", element: <InventoryListPage/> },
            { path: "supplierList", element: <SupplierListPage/> },
            { path: "productList", element: <ProductListPage/> },
            { path: "readUser", element: <ReadUser/> },
            { path: "readSupplier", element: <ReadSupplier/> },
            { path: "readMenu", element: <ReadMenu/> },
            { path: "readUser3", element: <ReadUserDavid/> },
            { path: "readUser2", element: <ReadUserDilan/> },
            { path: "readUser4", element: <ReadUserNicolas/> },
            { path: "readUser5", element: <ReadUserMaycol/> },
            // { path: "PermitManagement", element: <PermitManagement /> },
            { path: "readSupplier1", element: <Supplier1/> },
            { path: "readSupplier2", element: <Supplier2/> },
            { path: "readSupplier3", element: <Supplier3/> },
            { path: "readSupplier4", element: <Supplier4/> },
            { path: "readMenu1", element: <CaféAme/> },
            { path: "readMenu2", element: <Capucchino/> },
            { path: "readMenu3", element: <Croissant/> },
            { path: "readMenu4", element: <TortaChocolate/> },
            // { path: "UpdateUser", element: <UpdateUser/> },
            // { path: "/dashboard/Card", element: <HomePage/> },
        ],
    },
    {
    path: "/CreateUser",
    element: <CreateUser />,
    children: [
            { index: true},
            // { path: "/dashboard/auth", element: <h1>Hello2</h1> },
            // { path: "/dashboard/userList", element: <h1>Hello3</h1> },
        ],
    },
    {
    path: "/CreateSupplier",
    element: <CreateSupplier />,
    children: [
            { index: true},
            // { path: "/dashboard/auth", element: <h1>Hello2</h1> },
            // { path: "/dashboard/userList", element: <h1>Hello3</h1> },
        ],
    },
    {
    path: "/CreateInventory",
    element: <CreateInventory />,
    children: [
            {
            index: true,
            },
        ],
    },
    {
    path: "/CreateMenu",
    element: <CreateMenu />,
    children: [
            {
            index: true,
            },
        ],
    },
    {
    path: "/UpdateUser",
    element: <UpdateUser />,
    children: [
            {
            index: true,
            },
        ],
    },
        {
    path: "/Permissions",
    element: <PermissionManagement />,
    {
    path: "/UpdateSupplier",
    element: <UpdateSupplier />,
    children: [
            {
            index: true,
            },
        ],
    }
]);

export default router;