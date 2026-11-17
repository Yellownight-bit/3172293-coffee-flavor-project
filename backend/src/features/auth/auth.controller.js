
import { authService } from "./auth.service.js";

export const authController = {

    // Iniciar sesión
    async login(req, res) {
        try {
            const result = await authService.login(req.body);

            res.status(200).json({
                message: "Login exitoso",
                ...result,
            });

        } catch (err) {
            res.status(401).json({
                error: err.message,
            });
        }
    },

    // Solicitar recuperación de contraseña
    async recoverPassword(req, res) {
        try {
            const result = await authService.recoverPassword(req.body);

            res.status(200).json(result);

        } catch (err) {
            console.error("Error al solicitar recuperación:", err.message);

            res.status(400).json({
                error: err.message,
            });
        }
    },

    // Verificar código de recuperación
    async verifyResetCode(req, res) {
        try {
            const result = await authService.verifyResetCode(req.body);

            res.status(200).json(result);

        } catch (err) {
            res.status(400).json({
                error: err.message,
            });
        }
    },

    // Restablecer contraseña
    async resetPassword(req, res) {
        try {
            const result = await authService.resetPassword(req.body);

            res.status(200).json(result);

        } catch (err) {
            res.status(400).json({
                error: err.message,
            });
        }
    },
};
