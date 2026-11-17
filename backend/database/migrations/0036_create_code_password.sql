
-- Tabla para almacenar los códigos de recuperación de contraseña
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,

    -- Usuario que solicita recuperar su contraseña
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Código de recuperación almacenado mediante hash
    code_hash VARCHAR(64) NOT NULL,

    -- Fecha de creación y vencimiento del código
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,

    -- Cantidad de intentos de verificación
    attempts INTEGER DEFAULT 0,

    -- Fecha en la que se utilizó el código
    used_at TIMESTAMP
);

-- Índice para consultar los códigos de un usuario
CREATE INDEX IF NOT EXISTS idx_password_reset_user
ON password_reset_tokens(user_id);
