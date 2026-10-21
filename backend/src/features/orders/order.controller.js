import { orderService } from "./order.service.js";

export const orderController = {
  async create(req, res) {
    console.log("BODY RECIBIDO:", req.body);

    try {
      const order = await orderService.createOrder(req.body);

      res.status(201).json({
        message: "Orden creada correctamente",
        orderId: order.id,
      });
    } catch (err) {
      console.error("ERROR BACKEND:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  },
};