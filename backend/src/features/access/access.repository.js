
// backend/src/features/access/access.repository.js

import { pool } from "../../config/db.js";

export const accessRepository = {
  async isSuperUser(userId) {
    const query = `
      SELECT is_superuser
      FROM users
      WHERE id = $1;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0]?.is_superuser ?? false;
  },

  async getUserPermissions(userId) {
    const query = `
      SELECT DISTINCT p.permission_codename
      FROM permissions p
      INNER JOIN user_permissions up
        ON up.permission_id = p.permission_id
      WHERE up.user_id = $1

      UNION

      SELECT DISTINCT p.permission_codename
      FROM permissions p
      INNER JOIN group_permissions gp
        ON gp.permission_id = p.permission_id
      INNER JOIN user_groups ug
        ON ug.group_id = gp.group_id
      WHERE ug.user_id = $1;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows.map((row) => row.permission_codename);
  },

  async getUserPermissionDetails(userId) {
    const directQuery = `
      SELECT
        p.permission_id,
        p.permission_name,
        p.permission_codename
      FROM user_permissions up
      INNER JOIN permissions p
        ON p.permission_id = up.permission_id
      WHERE up.user_id = $1
      ORDER BY p.permission_name;
    `;

    const inheritedQuery = `
      SELECT DISTINCT
        p.permission_id,
        p.permission_name,
        p.permission_codename,
        g.group_name
      FROM user_groups ug
      INNER JOIN groups g
        ON g.group_id = ug.group_id
      INNER JOIN group_permissions gp
        ON gp.group_id = g.group_id
      INNER JOIN permissions p
        ON p.permission_id = gp.permission_id
      WHERE ug.user_id = $1
      ORDER BY p.permission_name;
    `;

    const [directResult, inheritedResult] = await Promise.all([
      pool.query(directQuery, [userId]),
      pool.query(inheritedQuery, [userId]),
    ]);

    return {
      directPermissions: directResult.rows,
      inheritedPermissions: inheritedResult.rows,
    };
  },

  async updateUserPermissions(userId, permissionIds) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `DELETE FROM user_permissions WHERE user_id = $1`,
        [userId],
      );

      if (permissionIds.length > 0) {
        await client.query(
          `
            INSERT INTO user_permissions (user_id, permission_id)
            SELECT $1, permission_id
            FROM UNNEST($2::INTEGER[]) AS permission_id;
          `,
          [userId, permissionIds],
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
