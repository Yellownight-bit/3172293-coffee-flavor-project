
import { API_URL } from "@/features/config";

const SUPPLIERS_URL = `${API_URL}/suppliers`;

export async function createSupplier(supplierData) {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();

  Object.entries(supplierData).forEach(([key, value]) => {
    if (key === "supplierImage") {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append("supplierImage", file);
          }
        });
      } else if (value instanceof File) {
        formData.append("supplierImage", value);
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

  const response = await fetch(SUPPLIERS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al crear el proveedor");
  }

  return data;
}

export async function getAllSuppliers() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(SUPPLIERS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al consultar los proveedores");
  }

  return response.json();
}

export async function updateSupplier(id, supplierData) {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();

  Object.entries(supplierData).forEach(([key, value]) => {
    if (key === "supplierImage") {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append("supplierImage", file);
          }
        });
      } else if (value instanceof File) {
        formData.append("supplierImage", value);
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

  const response = await fetch(`${SUPPLIERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al actualizar el proveedor");
  }

  return data;
}

export async function updateSupplierStatus(id, is_active) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${SUPPLIERS_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ is_active }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al cambiar el estado del proveedor");
  }

  return data;
}
