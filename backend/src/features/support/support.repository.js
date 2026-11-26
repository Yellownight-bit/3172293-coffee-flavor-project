
import { pool } from "../../config/db.js";

export const supportRepository = {
    async getSupportEmail() {
        const query = `
            SELECT
                support_email,
                updated_at
            FROM system_settings
            ORDER BY id ASC
            LIMIT 1;
        `;

        const result = await pool.query(query);

        return result.rows[0] || null;
    },

    async updateSupportEmail(email, userId) {
        const query = `
            UPDATE system_settings
            SET
                support_email = $1,
                updated_at = NOW(),
                updated_by = $2
            WHERE id = (
                SELECT id
                FROM system_settings
                ORDER BY id ASC
                LIMIT 1
            )
            RETURNING
                support_email,
                updated_at,
                updated_by;
        `;

        const result = await pool.query(query, [email, userId]);

        return result.rows[0] || null;
    },
};
