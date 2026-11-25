
BEGIN;

-- Crear permiso para editar usuarios
INSERT INTO permissions (
    permission_name,
    permission_codename,
    content_type_id
)
SELECT
    'Editar usuarios',
    'update_user',
    content_type_id
FROM content_type
WHERE app_label = 'users'
  AND model = 'user'
ON CONFLICT (permission_codename)
DO UPDATE SET
    permission_name = EXCLUDED.permission_name,
    content_type_id = EXCLUDED.content_type_id,
    updated_at = NOW();


-- Crear permiso para deshabilitar proveedores
INSERT INTO permissions (
    permission_name,
    permission_codename,
    content_type_id
)
SELECT
    'Deshabilitar proveedores',
    'disable_supplier',
    content_type_id
FROM content_type
WHERE app_label = 'suppliers'
  AND model = 'supplier'
ON CONFLICT (permission_codename)
DO UPDATE SET
    permission_name = EXCLUDED.permission_name,
    content_type_id = EXCLUDED.content_type_id,
    updated_at = NOW();

COMMIT;
