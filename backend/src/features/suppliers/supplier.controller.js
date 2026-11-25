
import { supplierService } from "./supplier.service.js";

export const supplierController = {
  async create(req, res) {
    try {
      const supplierImage = req.files?.[0]
        ? `/uploads/suppliers/${req.files[0].filename}`
        : null;

      const supplier = await supplierService.createSupplier({
        ...req.body,
        supplierImage,
      });

      return res.status(201).json({
        message: "Proveedor creado correctamente",
        supplierId: supplier.id,
      });
    } catch (err) {
      console.error("ERROR AL CREAR PROVEEDOR:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const suppliers = await supplierService.getAllSuppliers();

      return res.status(200).json(suppliers);
    } catch (err) {
      console.error("ERROR AL CONSULTAR PROVEEDORES:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const supplierImage = req.files?.[0]
        ? `/uploads/suppliers/${req.files[0].filename}`
        : null;

      const updatedSupplier = await supplierService.updateSupplier(id, {
        ...req.body,
        supplierImage,
      });

      if (!updatedSupplier) {
        return res.status(404).json({
          error: "Proveedor no encontrado",
        });
      }

      return res.status(200).json({
        message: "Proveedor actualizado correctamente",
        supplier: updatedSupplier,
      });
    } catch (error) {
      console.error("ERROR AL ACTUALIZAR PROVEEDOR:", error);

      return res.status(500).json({
        error: error.message,
      });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      const updatedSupplier = await supplierService.updateSupplierStatus(
        id,
        is_active
      );

      if (!updatedSupplier) {
        return res.status(404).json({
          error: "Proveedor no encontrado",
        });
      }

      return res.status(200).json({
        message: "Estado del proveedor actualizado",
        supplier: updatedSupplier,
      });
    } catch (error) {
      console.error("ERROR AL ACTUALIZAR ESTADO:", error);

      return res.status(500).json({
        error: error.message,
      });
    }
  },
};
