
BEGIN;

-- 1. Corregir el permiso que quedó asociado incorrectamente
-- al módulo de Usuarios.

UPDATE permissions
SET
    permission_name = 'Eliminar usuarios',
    permission_codename = 'delete_user',
    content_type_id = (
        SELECT content_type_id
        FROM content_type
        WHERE app_label = 'users'
          AND model = 'user'
    ),
    updated_at = NOW()
WHERE permission_codename = 'create_order'
  AND content_type_id = (
      SELECT content_type_id
      FROM content_type
      WHERE app_label = 'users'
        AND model = 'user'
  );

-- 2. Crear el permiso correcto para el módulo de Órdenes.

INSERT INTO permissions (
    permission_name,
    permission_codename,
    content_type_id
)
SELECT
    'Crear órdenes',
    'create_order',
    content_type_id
FROM content_type
WHERE app_label = 'orders'
  AND model = 'order'
ON CONFLICT (permission_codename)
DO UPDATE SET
    permission_name = EXCLUDED.permission_name,
    content_type_id = EXCLUDED.content_type_id,
    updated_at = NOW();

COMMIT;
