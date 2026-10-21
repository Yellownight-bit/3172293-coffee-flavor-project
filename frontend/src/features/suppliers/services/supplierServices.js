import { API_URL } from "@/features/config";

const SUPPLIERS_URL = `${API_URL}/suppliers`;

export async function createSupplier(supplierData) {
  const response = await fetch(SUPPLIERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supplierData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al crear el proveedor");
  }

  return response.json();
}
