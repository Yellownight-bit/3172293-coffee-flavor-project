
import { Router } from "express";
import { productController } from "./product.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { uploadProducts } from "../../config/multer.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  requirePermission("create_product"),
  uploadProducts.array("productImage", 1),
  productController.create
);

router.get(
  "/",
  authenticateToken,
  requirePermission("list_product"),
  productController.getAll
);

router.put(
  "/:id",
  authenticateToken,
  requirePermission("update_product"),
  uploadProducts.array("productImage", 1),
  productController.update
);

export default router;
