
import { Router } from "express";
import { supportController } from "./support.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

// Consultar correo de soporte (público)
router.get(
    "/",
    supportController.getSupportEmail
);

// Actualizar correo de soporte (solo usuarios autorizados)
router.put(
    "/",
    authenticateToken,
    requirePermission("manage_support_email"),
    supportController.updateSupportEmail
);

export default router;
