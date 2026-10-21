import { API_URL } from "@/features/config";

const INVENTORY_URL = `${API_URL}/inventory`;

export async function createInventory(inventoryData) {
  const response = await fetch(INVENTORY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inventoryData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al registrar el producto en el inventario");
  }

  return response.json();
}
