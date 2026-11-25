
// backend/src/features/access/access.service.js

import { accessRepository } from "./access.repository.js";
import { pool } from "../../config/db.js";

export const accessService = {
  async hasPermission(userId, permissionCode) {
    const isSuperUser = await accessRepository.isSuperUser(userId);

    if (isSuperUser) {
      return true;
    }

    const permissions = await accessRepository.getUserPermissions(userId);

    return permissions.includes(permissionCode);
  },

  async getUserPermissionDetails(userId) {
    return await accessRepository.getUserPermissionDetails(userId);
  },

  async updateUserPermissions(userId, permissionIds) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("ID de usuario inválido");
    }

    if (!Array.isArray(permissionIds)) {
      throw new Error("Los permisos deben enviarse como un arreglo");
    }

    if (
      !permissionIds.every(
        (id) => Number.isInteger(id) && id > 0
      )
    ) {
      throw new Error("Hay identificadores de permisos inválidos");
    }

    if (new Set(permissionIds).size !== permissionIds.length) {
      throw new Error("Hay permisos duplicados");
    }

    const userResult = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error("El usuario no existe");
    }

    if (permissionIds.length > 0) {
      const permissionsResult = await pool.query(
        `
          SELECT permission_id
          FROM permissions
          WHERE permission_id = ANY($1::INTEGER[]);
        `,
        [permissionIds]
      );

      if (permissionsResult.rows.length !== permissionIds.length) {
        throw new Error("Uno o varios permisos no existen");
      }
    }

    return await accessRepository.updateUserPermissions(
      userId,
      permissionIds
    );
  },
};
