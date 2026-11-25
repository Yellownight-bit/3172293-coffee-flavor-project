INSERT INTO user_groups (user_id, group_id)
SELECT
    u.id,
    g.group_id
FROM users u
INNER JOIN groups g
    ON LOWER(TRIM(u.rol)) = LOWER(TRIM(g.group_name))
ON CONFLICT (user_id, group_id) DO NOTHING;