
// backend/src/features/access/access.controller.js

import { accessService } from "./access.service.js";

export const accessController = {
  // Verificar si un usuario tiene un permiso
  async testPermission(req, res) {
    try {
      const userId = req.user.id;
      const permissionCode = req.params.permissionCode;

      const hasPermission = await accessService.hasPermission(
        userId,
        permissionCode,
      );

      res.json({
        userId,
        permission: permissionCode,
        granted: hasPermission,
      });
    } catch (error) {
      console.error("Error verificando permiso:", error);

      res.status(500).json({
        error: "Error verificando el permiso",
      });
    }
  },

  // Obtener permisos directos y heredados de un usuario
  async getUserPermissionDetails(req, res) {
    try {
      const userId = Number(req.params.userId);

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          error: "ID de usuario inválido",
        });
      }

      const permissions = await accessService.getUserPermissionDetails(
        userId,
      );

      res.status(200).json(permissions);
    } catch (error) {
      console.error("Error obteniendo permisos del usuario:", error);

      res.status(500).json({
        error: "Error obteniendo los permisos del usuario",
      });
    }
  },

  // Actualizar permisos individuales de un usuario
  async updateUserPermissions(req, res) {
    try {
      const userId = Number(req.params.userId);
      const { permissionIds } = req.body;

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          error: "ID de usuario inválido",
        });
      }

      await accessService.updateUserPermissions(
        userId,
        permissionIds,
      );

      res.status(200).json({
        message: "Permisos individuales actualizados correctamente",
      });
    } catch (error) {
      console.error("Error actualizando permisos individuales:", error);

      const validationErrors = [
        "Los permisos deben enviarse como un arreglo",
        "Hay identificadores de permisos inválidos",
        "Hay permisos duplicados",
        "El usuario no existe",
        "Uno o varios permisos no existen",
        "ID de usuario inválido",
      ];

      if (validationErrors.includes(error.message)) {
        return res.status(400).json({
          error: error.message,
        });
      }

      res.status(500).json({
        error: "Error actualizando los permisos del usuario",
      });
    }
  },
};
