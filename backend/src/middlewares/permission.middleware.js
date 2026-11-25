// backend/src/middlewares/permission.middleware.js

import { accessService } from "../features/access/access.service.js";

export const requirePermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          message: "Usuario no autenticado",
        });
      }

      const granted = await accessService.hasPermission(
        userId,
        permissionCode
      );

      if (!granted) {
        return res.status(403).json({
          message: "No tiene permisos para realizar esta acción",
          permission: permissionCode,
        });
      }

      next();
    } catch (error) {
      console.error("Error verificando permisos:", error);

      return res.status(500).json({
        message: "Error al verificar los permisos",
      });
    }
  };
};