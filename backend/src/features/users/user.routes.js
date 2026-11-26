
import { Router } from "express";
import { userController } from "./user.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { uploadUsers } from "../../config/multer.js";

const router = Router();

// Registro público desde el login
router.post(
    "/register",
    uploadUsers.array("userImage", 1),
    userController.create,
);

// Crear usuario desde el sistema
router.post(
    "/",
    authenticateToken,
    requirePermission("create_user"),
    uploadUsers.array("userImage", 1),
    userController.create,
);

// Obtener usuarios para gestión de permisos
router.get(
    "/permissions",
    authenticateToken,
    userController.getUsersForPermissions,
);

// Obtener perfil del usuario autenticado
router.get(
    "/me",
    authenticateToken,
    userController.getMyProfile,
);

// Obtener todos los usuarios
router.get(
    "/",
    authenticateToken,
    requirePermission("list_user"),
    userController.getAll,
);

// Actualizar usuario
router.put(
    "/:id",
    authenticateToken,
    requirePermission("update_user"),
    uploadUsers.array("userImage", 1),
    userController.update,
);

// Actualizar estado del usuario
router.patch(
    "/:id",
    authenticateToken,
    requirePermission("disable_user"),
    userController.updateStatus,
);

export default router;
