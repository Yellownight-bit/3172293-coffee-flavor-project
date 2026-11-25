
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Importamos las rutas del feature
import userRoutes from "./features/users/user.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import supplierRoutes from "./features/suppliers/supplier.routes.js";
import inventoryRoutes from "./features/inventory/inventory.routes.js";
import productRoutes from "./features/products/product.routes.js";
import orderRoutes from "./features/orders/order.routes.js";
import accessRoutes from "./features/access/access.routes.js";
import groupsRoutes from "./features/groups/groups.routes.js";
import permissionsRoutes from "./features/permissions/permissions.routes.js";

// Creamos la instancia principal de Express
const app = express();

// Obtenemos la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware de CORS
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware para procesar JSON
app.use(express.json());

// Servir archivos estáticos de uploads
app.use(
    "/uploads",
    express.static(path.resolve(__dirname, "../uploads"))
);

// Registro de rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/permissions", permissionsRoutes);

// Exportamos la aplicación
export default app;
