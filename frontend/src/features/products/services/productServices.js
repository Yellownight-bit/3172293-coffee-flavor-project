import { API_URL } from "@/features/config";

const PRODUCTS_URL = `${API_URL}/products`;

export async function createProduct(productData) {
  const response = await fetch(PRODUCTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al crear el producto");
  }

  return response.json();
}