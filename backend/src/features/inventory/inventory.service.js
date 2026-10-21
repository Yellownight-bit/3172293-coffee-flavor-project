import { inventoryRepository } from "./inventory.repository.js";

export const inventoryService = {
  async createInventory(data) {
    return await inventoryRepository.create(data);
  },
};
