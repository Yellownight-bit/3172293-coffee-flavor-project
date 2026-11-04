import { productRepository } from "./product.repository.js";

export const productService = {
  async createProduct(data) {
    return await productRepository.create(data);
  },

  async getAllProducts() {
    return await productRepository.findAll();
  },
};