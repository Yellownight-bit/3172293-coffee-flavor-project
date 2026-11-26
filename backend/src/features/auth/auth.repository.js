
import { pool } from "../../config/db.js";

export const authRepository = {
    // Buscar usuario por correo electrónico
    async findByEmail(userEmail) {
        const query = `
            SELECT
                id,
                user_email,
                user_password AS password,
                is_active,
                rol,
                accepted_data_policy,
                data_policy_accepted_at
            FROM users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);

        return result.rows[0];
    },

    // Registrar aceptación de la política
    async acceptDataPolicy(userId) {
        const query = `
            UPDATE users
            SET
                accepted_data_policy = TRUE,
                data_policy_accepted_at = COALESCE(
                    data_policy_accepted_at,
                    NOW()
                )
            WHERE id = $1
            RETURNING
                accepted_data_policy,
                data_policy_accepted_at;
        `;

        const result = await pool.query(query, [userId]);

        return result.rows[0];
    },

    // Invalidar códigos de recuperación anteriores
    async invalidateResetTokens(userId) {
        const query = `
            UPDATE password_reset_tokens
            SET used_at = NOW()
            WHERE user_id = $1
            AND used_at IS NULL;
        `;

        await pool.query(query, [userId]);
    },

    // Crear un nuevo código de recuperación
    async createResetToken(userId, codeHash) {
        const query = `
            INSERT INTO password_reset_tokens (
                user_id,
                code_hash,
                expires_at
            )
            VALUES (
                $1,
                $2,
                NOW() + INTERVAL '10 minutes'
            )
            RETURNING id;
        `;

        const result = await pool.query(query, [userId, codeHash]);

        return result.rows[0];
    },

    // Buscar un código válido de recuperación
    async findValidResetToken(userId) {
        const query = `
            SELECT
                id,
                code_hash,
                attempts
            FROM password_reset_tokens
            WHERE user_id = $1
            AND used_at IS NULL
            AND expires_at > NOW()
            AND attempts < 5
            ORDER BY created_at DESC
            LIMIT 1;
        `;

        const result = await pool.query(query, [userId]);

        return result.rows[0];
    },

    // Incrementar los intentos de verificación
    async incrementResetAttempts(tokenId) {
        const query = `
            UPDATE password_reset_tokens
            SET attempts = attempts + 1
            WHERE id = $1;
        `;

        await pool.query(query);
    },

    // Actualizar la contraseña del usuario
    async updatePassword(userId, passwordHash) {
        const query = `
            UPDATE users
            SET user_password = $1
            WHERE id = $2;
        `;

        await pool.query(query, [passwordHash, userId]);
    },

    // Marcar el código como utilizado
    async markResetTokenUsed(tokenId) {
        const query = `
            UPDATE password_reset_tokens
            SET used_at = NOW()
            WHERE id = $1;
        `;

        await pool.query(query, [tokenId]);
    }
};
