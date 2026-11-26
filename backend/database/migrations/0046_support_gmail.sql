BEGIN;

-- Crear permiso para gestionar el correo de soporte
INSERT INTO permissions (
    permission_name,
    permission_codename,
    content_type_id
)
VALUES (
    'Gestionar correo de soporte',
    'manage_support_email',
    1
)
ON CONFLICT (permission_codename)
DO UPDATE SET
    permission_name = EXCLUDED.permission_name,
    content_type_id = EXCLUDED.content_type_id,
    updated_at = NOW();


-- Asignar permiso exclusivamente al grupo Administrador
INSERT INTO group_permissions (
    group_id,
    permission_id
)
SELECT
    1,
    permission_id
FROM permissions
WHERE permission_codename = 'manage_support_email'
ON CONFLICT DO NOTHING;

COMMIT;