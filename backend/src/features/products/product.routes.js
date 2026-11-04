import { Router } from "express";
import { productController } from "./product.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", productController.create);
router.get("/", authenticateToken, productController.getAll);

export default router;