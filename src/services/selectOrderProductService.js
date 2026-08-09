import { products } from "@/features/products/data/products.js";

export const getOrderProducts = async () => {
  return products.map((product) => ({
    value: product.id,
    label: product.title,
  }));
};