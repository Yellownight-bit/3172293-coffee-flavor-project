
import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { uploadInventory } from "../../config/multer.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  requirePermission("create_inventory"),
  uploadInventory.array("productImage", 1),
  inventoryController.create
);

router.get(
  "/",
  authenticateToken,
  requirePermission("list_inventory"),
  inventoryController.getAll
);

router.put(
  "/:id",
  authenticateToken,
  requirePermission("update_inventory"),
  uploadInventory.array("productImage", 1),
  inventoryController.update
);

export default router;
