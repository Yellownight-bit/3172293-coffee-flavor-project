import { orderRepository } from "./order.repository.js";

export const orderService = {
  async createOrder(data) {
    return await orderRepository.create(data);
  },
};