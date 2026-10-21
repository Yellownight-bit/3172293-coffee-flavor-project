import { API_URL } from "@/features/config";

const ORDERS_URL = `${API_URL}/orders`;

export async function createOrder(orderData) {
  const response = await fetch(ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al crear la orden");
  }

  return response.json();
}