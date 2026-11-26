
import { API_URL } from "@/features/config";

const ORDERS_URL = `${API_URL}/orders`;

export async function createOrder(orderData) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error del servidor al crear orden:", {
      status: response.status,
      response: data,
    });

    throw new Error(
      data.error ||
        data.message ||
        JSON.stringify(data) ||
        "Error al crear la orden"
    );
  }

  return data;
}

export async function getAllOrders() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(ORDERS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al consultar las órdenes");
  }

  return data;
}

export async function updateOrder(id, orderData) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${ORDERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al actualizar la orden");
  }

  return data;
}

export async function updateOrderStatus(id, status) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${ORDERS_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al actualizar el estado de la orden");
  }

  return data;
}
