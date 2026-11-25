
import { productService } from "./product.service.js";

export const productController = {
  async create(req, res) {
    try {
      const productImage = req.files?.[0]
        ? `/uploads/products/${req.files[0].filename}`
        : null;

      const product = await productService.createProduct({
        ...req.body,
        productImage,
      });

      return res.status(201).json({
        message: "Producto creado correctamente",
        productId: product.id,
      });
    } catch (err) {
      console.error("ERROR AL CREAR PRODUCTO:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const products = await productService.getAllProducts();

      return res.status(200).json(products);
    } catch (err) {
      console.error("ERROR AL OBTENER PRODUCTOS:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const productImage = req.files?.[0]
        ? `/uploads/products/${req.files[0].filename}`
        : null;

      const product = await productService.updateProduct(id, {
        ...req.body,
        productImage,
      });

      if (!product) {
        return res.status(404).json({
          error: "Producto no encontrado",
        });
      }

      return res.status(200).json({
        message: "Producto actualizado correctamente",
        product,
      });
    } catch (err) {
      console.error("ERROR AL ACTUALIZAR PRODUCTO:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  },
};
