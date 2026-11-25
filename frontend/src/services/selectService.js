
import { getAllSuppliers } from "@/features/suppliers/services/supplierServices";

export async function getDocumentTypes() {
  const res = await fetch("/src/data/selects/documentTypes.json");
  return res.json();
}

export async function getSupplierNames() {
  const suppliers = await getAllSuppliers();

  return suppliers
    .filter((supplier) => supplier.is_active)
    .map((supplier) => ({
      value: supplier.id,
      label: supplier.supplier_name,
    }));
}
