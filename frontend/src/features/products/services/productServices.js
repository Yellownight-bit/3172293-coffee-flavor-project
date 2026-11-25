
import { API_URL } from "@/features/config";

const PRODUCTS_URL = `${API_URL}/products`;

export async function createProduct(productData) {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();

  Object.entries(productData).forEach(([key, value]) => {
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

  const response = await fetch(PRODUCTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al crear el producto");
  }

  return data;
}

export async function getAllProducts() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(PRODUCTS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al obtener los productos");
  }

  return data;
}

export async function updateProduct(id, productData) {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();

  Object.entries(productData).forEach(([key, value]) => {
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

  const response = await fetch(`${PRODUCTS_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al actualizar el producto");
  }

  return data;
}
