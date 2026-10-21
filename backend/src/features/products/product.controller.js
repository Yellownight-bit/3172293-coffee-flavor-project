import { productService } from "./product.service.js";

export const productController = {
  async create(req, res) {
    console.log("BODY RECIBIDO:", req.body);

    try {
      const product = await productService.createProduct(req.body);

      res.status(201).json({
        message: "Producto creado correctamente",
        productId: product.id,
      });
    } catch (err) {
      console.error("ERROR BACKEND:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  },
};