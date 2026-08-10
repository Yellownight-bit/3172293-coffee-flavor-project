import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import CreateUser  from "@/features/create/CreateUser";
import CreateSupplier from "@/features/create/CreateSupplier"
import CreateInventory from "@/features/create/CreateInventory"
import CreateProduct from "@/features/create/CreateProduct"
import CreateOrder from "@/features/create/CreateOrder"
import { UserRegisterForm } from "../features/users";
import { UserListPage } from "@/features/users";
import { InventoryListPage } from "@/features/inventory";
import { HomePage } from "@/features/home"
import { SupplierListPage } from "@/features/suppliers";
import { ProductListPage } from "../features/products";
import { OrderListPage } from "../features/order";

import ReadUser from "@/features/read/ReadUser"
import ReadSupplier from "@/features/read/ReadSupplier"
import ReadMenu from "@/features/read/ReadMenu"
import ReadUserDavid from "@/features/read/users/ReadUserDavid"

import UpdateUser from "@/features/update/users/UpdateUser"
import UpdateSupplier from "@/features/update/suppliers/UpdateSupplier"
import UpdateInventory from "@/features/update/inventory/UpdateInventory"
import UpdateProduct from "@/features/update/products/UpdateProduct"
import UpdateOrder from "@/features/update/order/UpdateOrder"

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
import { ReadOrder } from "@/features/read/orders";

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
            { path: "/dashboard/userList", element: <UserListPage/> },
            { path: "/dashboard/userCreate", element: <UserRegisterForm/> },
            { path: "inventoryList", element: <InventoryListPage/> },
            { path: "supplierList", element: <SupplierListPage/> },
            { path: "productList", element: <ProductListPage/> },
            { path: "orderList", element: <OrderListPage/> },
            { path: "readUser", element: <ReadUser/> },
            { path: "readSupplier", element: <ReadSupplier/> },
            { path: "readMenu", element: <ReadMenu/> },
            { path: "readUser3", element: <ReadUserDavid/> },
            { path: "readUser2", element: <ReadUserDilan/> },
            { path: "readUser4", element: <ReadUserNicolas/> },
            { path: "readUser5", element: <ReadUserMaycol/> },
            { path: "readSupplier1", element: <Supplier1/> },
            { path: "readSupplier2", element: <Supplier2/> },
            { path: "readSupplier3", element: <Supplier3/> },
            { path: "readSupplier4", element: <Supplier4/> },
            { path: "readMenu1", element: <CaféAme/> },
            { path: "readMenu2", element: <Capucchino/> },
            { path: "readMenu3", element: <Croissant/> },
            { path: "readMenu4", element: <TortaChocolate/> },
            { path: "UpdateUser", element: <UpdateUser/> },
            { path: "/dashboard/ReadOrder", element: <ReadOrder /> },
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
    path: "/CreateProduct",
    element: <CreateProduct />,
    children: [
            {
            index: true,
            },
        ],
    },
    {
    path: "/CreateOrder",
    element: <CreateOrder />,
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
    },
    {
    path: "/UpdateSupplier",
    element: <UpdateSupplier />,
    children: [
            {
            index: true,
            },
        ],
    },
    {
    path: "/UpdateInventory",
    element: <UpdateInventory />,
    children: [
            {
            index: true,
            },
        ],
    },
    {
    path: "/UpdateProduct",
    element: <UpdateProduct />,
    children: [
            {
            index: true,
            },
        ],
    },
    {
    path: "/UpdateOrder",
    element: <UpdateOrder />,
    children: [
            {
            index: true,
            },
        ],
    }
]);

export default router;