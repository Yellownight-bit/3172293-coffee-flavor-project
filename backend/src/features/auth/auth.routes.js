
import { Router } from "express";
import { authController } from "./auth.controller.js";

const router = Router();

// Iniciar sesión
router.post("/login", authController.login);

// Solicitar recuperación de contraseña
router.post("/recover-password", authController.recoverPassword);

// Verificar código de recuperación
router.post("/verify-code", authController.verifyResetCode);

// Restablecer contraseña
router.post("/reset-password", authController.resetPassword);

export default router;
