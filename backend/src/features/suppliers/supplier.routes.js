
import { Router } from "express";
import { supplierController } from "./supplier.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { uploadSuppliers } from "../../config/multer.js";

const router = Router();

// Crear proveedor
router.post(
  "/",
  authenticateToken,
  requirePermission("create_supplier"),
  uploadSuppliers.array("supplierImage", 1),
  supplierController.create
);

// Obtener todos los proveedores
router.get(
  "/",
  authenticateToken,
  requirePermission("list_supplier"),
  supplierController.getAll
);

// Actualizar proveedor
router.put(
  "/:id",
  authenticateToken,
  requirePermission("update_supplier"),
  uploadSuppliers.array("supplierImage", 1),
  supplierController.update
);

// Actualizar estado del proveedor
router.patch(
  "/:id",
  authenticateToken,
  requirePermission("disable_supplier"),
  supplierController.updateStatus
);

export default router;
