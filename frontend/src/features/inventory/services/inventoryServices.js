
import { API_URL } from "@/features/config";

const INVENTORY_URL = `${API_URL}/inventory`;

export async function createInventory(inventoryData) {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();

  Object.entries(inventoryData).forEach(([key, value]) => {
    if (key === "productImage") {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append("productImage", file);
          }
        });
      } else if (value instanceof File) {
        formData.append("productImage", value);
      }

      return;
    }

    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  const response = await fetch(INVENTORY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Error al registrar el producto en el inventario"
    );
  }

  return data;
}

export async function getAllInventory() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(INVENTORY_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al obtener el inventario");
  }

  return data;
}

export async function updateInventory(id, inventoryData) {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();

  Object.entries(inventoryData).forEach(([key, value]) => {
    if (key === "productImage") {
      if (value instanceof File) {
        formData.append("productImage", value);
      } else if (Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append("productImage", file);
          }
        });
      }

      return;
    }

    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  const response = await fetch(`${INVENTORY_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al actualizar el inventario");
  }

  return data;
}
