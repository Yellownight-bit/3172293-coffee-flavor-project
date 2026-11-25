
BEGIN;

DELETE FROM users
WHERE id = 8
  AND user_name = 'Jacobo Agudelo López'
  AND user_document_number = '2290076404'
  AND rol = 'administrador';

COMMIT;
