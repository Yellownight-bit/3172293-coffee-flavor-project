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
    }
]);

export default router;