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
        } = userData;

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
                is_superuser
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    },
};