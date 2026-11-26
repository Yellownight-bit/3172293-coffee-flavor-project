
import { supportService } from "./support.service.js";

export const supportController = {
    async getSupportEmail(req, res) {
        try {
            const settings = await supportService.getSupportEmail();

            return res.status(200).json(settings);
        } catch (error) {
            console.error("Error obteniendo correo de soporte:", error);

            return res.status(500).json({
                error: error.message,
            });
        }
    },

    async updateSupportEmail(req, res) {
        try {
            const { supportEmail } = req.body;

            const updated = await supportService.updateSupportEmail(
                supportEmail,
                req.user.id
            );

            return res.status(200).json({
                message: "Correo de soporte actualizado correctamente",
                settings: updated,
            });
        } catch (error) {
            console.error("Error actualizando correo de soporte:", error);

            return res.status(400).json({
                error: error.message,
            });
        }
    },
};
