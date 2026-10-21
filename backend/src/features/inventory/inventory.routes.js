import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";

const router = Router();

router.post("/", inventoryController.create);

export default router;
