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

  async getAll(req, res) {
    try {
      const inventory = await inventoryService.getAllInventory();

      return res.status(200).json(inventory);
    } catch (err) {
      console.error("ERROR AL OBTENER INVENTARIO:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  },
};