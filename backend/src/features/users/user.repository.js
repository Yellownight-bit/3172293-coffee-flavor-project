
import { pool } from "../../config/db.js";

export const userRepository = {

    async create(userData) {

        const {
            userName,
            userEmail,
            confirmEmail,
            userPhone,
            userAddress,
            userDocumentTypes,
            userDocumentNumber,
            userPassword,
            userImage,
            isStaff,
            isActive,
            isSuperUser,
            rol,
        } = userData;

        const acceptedDataPolicy =
            userData.acceptedDataPolicy === true ||
            userData.acceptedDataPolicy === "true";

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const query = `
                INSERT INTO users (
                    user_name,
                    user_email,
                    confirm_email,
                    user_phone,
                    user_address,
                    user_document_types,
                    user_document_number,
                    user_password,
                    user_image,
                    is_staff,
                    is_active,
                    is_superuser,
                    rol,
                    accepted_data_policy,
                    data_policy_accepted_at
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11, $12, $13,
                    $14,
                    CASE WHEN $14 = TRUE THEN NOW() ELSE NULL END
                )
                RETURNING id;
            `;

            const values = [
                userName,
                userEmail,
                confirmEmail,
                userPhone,
                userAddress,
                userDocumentTypes,
                userDocumentNumber,
                userPassword,
                userImage,
                isStaff,
                isActive,
                isSuperUser,
                rol,
                acceptedDataPolicy,
            ];

            const result = await client.query(query, values);
            const userId = result.rows[0].id;

            if (rol?.toLowerCase() === "administrador") {
                const groupResult = await client.query(
                    `
                        SELECT group_id
                        FROM groups
                        WHERE LOWER(TRIM(group_name)) = 'administrador'
                        LIMIT 1;
                    `
                );

                if (groupResult.rows.length === 0) {
                    throw new Error("No existe el grupo Administrador");
                }

                await client.query(
                    `
                        INSERT INTO user_groups (
                            user_id,
                            group_id
                        )
                        VALUES ($1, $2);
                    `,
                    [userId, groupResult.rows[0].group_id]
                );
            }

            await client.query("COMMIT");

            return { id: userId };

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    async findAll() {

        const query = `
            SELECT *
            FROM users
            ORDER BY id ASC;
        `;

        const result = await pool.query(query);

        return result.rows;
    },

    async findProfileById(id) {

        const query = `
            SELECT
                id,
                user_name,
                user_email,
                confirm_email,
                user_phone,
                user_address,
                user_document_types,
                user_document_number,
                user_image,
                is_staff,
                is_active,
                is_superuser,
                rol,
                created_at
            FROM users
            WHERE id = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    },

    async update(id, userData) {

        const {
            userName,
            userEmail,
            confirmEmail,
            userPhone,
            userAddress,
            userDocumentTypes,
            userDocumentNumber,
            userPassword,
            userImage,
            isStaff,
            isActive,
            isSuperUser,
            rol,
        } = userData;

        const acceptedDataPolicy =
            userData.acceptedDataPolicy === true ||
            userData.acceptedDataPolicy === "true";

        const query = `
            UPDATE users
            SET
                user_name = $1,
                user_email = $2,
                confirm_email = $3,
                user_phone = $4,
                user_address = $5,
                user_document_types = $6,
                user_document_number = $7,
                user_password = COALESCE($8, user_password),
                user_image = COALESCE($9, user_image),
                is_staff = $10,
                is_active = $11,
                is_superuser = $12,
                rol = $13,
                data_policy_accepted_at = CASE
                    WHEN $14 = TRUE AND accepted_data_policy = FALSE
                        THEN NOW()
                    WHEN $14 = FALSE
                        THEN NULL
                    ELSE data_policy_accepted_at
                END,
                accepted_data_policy = $14
            WHERE id = $15
            RETURNING
                id,
                user_name,
                user_email,
                confirm_email,
                user_phone,
                user_address,
                user_document_types,
                user_document_number,
                user_image,
                is_staff,
                is_active,
                is_superuser,
                rol,
                accepted_data_policy,
                data_policy_accepted_at;
        `;

        const values = [
            userName,
            userEmail,
            confirmEmail,
            userPhone,
            userAddress,
            userDocumentTypes,
            userDocumentNumber,
            userPassword,
            userImage || null,
            isStaff,
            isActive,
            isSuperUser,
            rol,
            acceptedDataPolicy,
            id,
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    },

    async updateStatus(id, is_active) {

        const query = `
            UPDATE users
            SET is_active = $1
            WHERE id = $2
            RETURNING *;
        `;

        const values = [is_active, id];

        const result = await pool.query(query, values);

        return result.rows[0];
    },

    async getUsersForPermissions() {

        const query = `
            SELECT
                id,
                user_name,
                user_email,
                is_active
            FROM users
            ORDER BY user_name ASC;
        `;

        const result = await pool.query(query);

        return result.rows;
    },
};
