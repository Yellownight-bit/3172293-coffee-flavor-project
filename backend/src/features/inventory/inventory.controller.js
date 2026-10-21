import { inventoryService } from "./inventory.service.js";

export const inventoryController = {
  async create(req, res) {
    console.log("BODY RECIBIDO:", req.body);

    try {
      const inventory = await inventoryService.createInventory(req.body);

      res.status(201).json({
        message: "Producto registrado correctamente en el inventario",
        inventoryId: inventory.id,
      });
    } catch (err) {
      console.error("ERROR BACKEND:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  },
};