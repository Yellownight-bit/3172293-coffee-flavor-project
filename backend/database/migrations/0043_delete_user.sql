
BEGIN;

DELETE FROM users
WHERE id = 9
  AND user_name = 'Jacobo Agudelo López'
  AND user_document_number = '2220076404'
  AND rol = 'administrador';

COMMIT;
