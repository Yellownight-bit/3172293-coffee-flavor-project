
// backend/src/features/access/access.routes.js

import { Router } from "express";
import { accessController } from "./access.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// Verificar permisos
router.get(
  "/check/:permissionCode",
  authenticateToken,
  accessController.testPermission,
);

// Consultar permisos directos y heredados de un usuario
router.get(
  "/users/:userId/permissions",
  authenticateToken,
  accessController.getUserPermissionDetails,
);

// Actualizar permisos individuales de un usuario
router.put(
  "/users/:userId/permissions",
  authenticateToken,
  accessController.updateUserPermissions,
);

export default router;
