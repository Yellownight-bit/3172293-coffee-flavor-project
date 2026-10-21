import { pool } from "../../config/db.js";

export const inventoryRepository = {
  async create(inventoryData) {
    const {
      productName,
      productId,
      productQuantity,
      productSupplierNames,
      productSupplierNit,
      productDescription,
      productPrice,
      productEntryDate,
      productImage,
      isActive,
      isStaff,
    } = inventoryData;

    const query = `
      INSERT INTO inventory (
        product_name,
        product_id,
        product_quantity,
        product_supplier_names,
        product_supplier_nit,
        product_description,
        product_price,
        product_entry_date,
        product_image,
        is_active,
        is_staff
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id;
    `;

    const values = [
      productName,
      Number(productId),
      Number(productQuantity),
      productSupplierNames,
      productSupplierNit,
      productDescription || null,
      Number(productPrice),
      productEntryDate,
      productImage || null,
      isActive,
      isStaff,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },
};
