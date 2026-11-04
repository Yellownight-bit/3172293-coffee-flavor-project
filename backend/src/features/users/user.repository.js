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

    // Método encargado de consultar todos los usuarios
    async findAll() {

        const query = `
            SELECT *
            FROM users
            ORDER BY id ASC;
        `;

        const result = await pool.query(query);

        return result.rows;
    },

    async updateStatus(id, is_active) { // Declara la funcion que recibe los parametros que el service le mando
        // Se ejecuta la sentencia sql para actualizar solo el estado
        const query = `
            UPDATE users
            SET is_active = $1
            WHERE id = $2
            RETURNING *;
        `; // En el arreglo iria en orden, values 1 el estado y 2 el id

        const values = [is_active, id] // Guarda el nuevo estado y el id del usuario
        const result = await pool.query(query, values); // Se le entrega la consulta y los valores a la BD y una vez los entrega de vuelta se guardan en result

        return result.rows[0]; // Para leer el objeto
    },
};