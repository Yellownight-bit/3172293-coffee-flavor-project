import { getAllProducts } from "@/features/products/services/productServices.js";

export const getOrderProducts = async () => {
  return await getAllProducts();
};