
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { authRepository } from "./auth.repository.js";
import { transporter } from "../../config/mailer.js";

export const authService = {

    // Iniciar sesión
    async login({ email, password, acceptedDataPolicy }) {
        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Credenciales inválidas");
        }

        if (!user.is_active) {
            throw new Error("Usuario inactivo");
        }

        // Verificar aceptación de la política
        if (!user.accepted_data_policy) {
            if (acceptedDataPolicy !== true) {
                throw new Error(
                    "Debes aceptar la política de tratamiento de datos personales."
                );
            }

            const acceptance = await authRepository.acceptDataPolicy(user.id);

            user.accepted_data_policy = acceptance.accepted_data_policy;
            user.data_policy_accepted_at = acceptance.data_policy_accepted_at;
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.user_email,
                rol: user.rol,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES },
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.user_email,
                rol: user.rol,
                acceptedDataPolicy: user.accepted_data_policy,
                dataPolicyAcceptedAt: user.data_policy_accepted_at,
            },
        };
    },

    // Solicitar recuperación de contraseña
    async recoverPassword({ email }) {
        if (!email) {
            throw new Error("Ingresa tu correo electrónico");
        }

        const user = await authRepository.findByEmail(email);

        // Respuesta genérica para no revelar si existe el correo
        if (!user) {
            return {
                message: "Si el correo está registrado, recibirás un código de recuperación.",
            };
        }

        // Invalidar códigos anteriores
        await authRepository.invalidateResetTokens(user.id);

        // Generar código aleatorio de seis dígitos
        const code = crypto.randomInt(100000, 1000000).toString();

        // Generar hash del código
        const codeHash = crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");

        // Guardar el código en la base de datos
        await authRepository.createResetToken(user.id, codeHash);

        // Enviar código por correo electrónico
        await transporter.sendMail({
            from: `"Coffee Flavor" <${process.env.EMAIL_USER}>`,
            to: user.user_email,
            subject: "Recuperación de contraseña - Coffee Flavor",
            text: `Tu código de recuperación es: ${code}. Tiene una vigencia de 10 minutos.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Recuperación de contraseña</h2>
                    <p>Hemos recibido una solicitud para recuperar tu contraseña.</p>
                    <p>Tu código de verificación es:</p>
                    <h1 style="letter-spacing: 8px;">${code}</h1>
                    <p>Este código tiene una vigencia de 10 minutos.</p>
                    <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
                    <strong>Coffee Flavor</strong>
                </div>
            `,
        });

        return {
            message: "Si el correo está registrado, recibirás un código de recuperación.",
        };
    },

    // Verificar código de recuperación
    async verifyResetCode({ email, code }) {
        if (!email || !code) {
            throw new Error("Ingresa el correo y el código de verificación");
        }

        if (!/^\d{6}$/.test(code)) {
            throw new Error("El código debe tener seis dígitos");
        }

        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new Error("Código inválido o expirado");
        }

        const resetToken = await authRepository.findValidResetToken(user.id);

        if (!resetToken) {
            throw new Error("Código inválido o expirado");
        }

        // Contabilizar el intento de verificación
        await authRepository.incrementResetAttempts(resetToken.id);

        // Calcular hash del código recibido
        const codeHash = crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(codeHash, "hex"),
            Buffer.from(resetToken.code_hash, "hex"),
        );

        if (!isValid) {
            throw new Error("Código inválido o expirado");
        }

        // Marcar el código como utilizado
        await authRepository.markResetTokenUsed(resetToken.id);

        // Generar autorización temporal para cambiar la contraseña
        const resetTokenJWT = jwt.sign(
            {
                id: user.id,
                purpose: "password_reset",
            },
            process.env.JWT_SECRET,
            { expiresIn: "5m" },
        );

        return {
            message: "Código verificado correctamente",
            resetToken: resetTokenJWT,
        };
    },

    // Restablecer contraseña
    async resetPassword({ resetToken, password }) {
        if (!resetToken || !password) {
            throw new Error("Completa todos los campos");
        }

        if (password.length < 8) {
            throw new Error("La contraseña debe tener mínimo 8 caracteres");
        }

        let decoded;

        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch {
            throw new Error("La autorización ha expirado o no es válida");
        }

        if (decoded.purpose !== "password_reset") {
            throw new Error("Autorización inválida");
        }

        // Cifrar la nueva contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Actualizar contraseña del usuario
        await authRepository.updatePassword(decoded.id, passwordHash);

        return {
            message: "Contraseña restablecida correctamente",
        };
    },
};
