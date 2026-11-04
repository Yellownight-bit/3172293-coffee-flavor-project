import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", inventoryController.create);
router.get("/", authenticateToken, inventoryController.getAll);

export default router;