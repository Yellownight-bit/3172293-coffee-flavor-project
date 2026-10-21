import { supplierService } from "./supplier.service.js";

export const supplierController = {
  async create(req, res) {
    console.log("BODY RECIBIDO:", req.body);

    try {
      const supplier = await supplierService.createSupplier(req.body);

      res.status(201).json({
        message: "Proveedor creado correctamente",
        supplierId: supplier.id,
      });
    } catch (err) {
      console.error("ERROR BACKEND:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  },
};
