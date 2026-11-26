
import { supportRepository } from "./support.repository.js";

export const supportService = {
    async getSupportEmail() {
        const settings = await supportRepository.getSupportEmail();

        if (!settings) {
            throw new Error("No existe una configuración de soporte");
        }

        return settings;
    },

    async updateSupportEmail(email, userId) {
        if (!email || typeof email !== "string") {
            throw new Error("Debes proporcionar un correo electrónico");
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            throw new Error("El correo electrónico no es válido");
        }

        const updated = await supportRepository.updateSupportEmail(
            normalizedEmail,
            userId
        );

        if (!updated) {
            throw new Error("No existe una configuración de soporte");
        }

        return updated;
    },
};
