
import { Router } from "express";
import { orderController } from "./order.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post(
    "/",
    authenticateToken,
    requirePermission("create_order"),
    orderController.create
);

router.get(
    "/",
    authenticateToken,
    requirePermission("list_order"),
    orderController.getAll
);

router.patch(
    "/:id/status",
    authenticateToken,
    requirePermission("update_order"),
    orderController.updateStatus
);

router.put(
    "/:id",
    authenticateToken,
    requirePermission("update_order"),
    orderController.update
);

export default router;
