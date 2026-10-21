import { pool } from "../../config/db.js";

export const supplierRepository = {
  async create(supplierData) {
    const {
      supplierName,
      supplierEmail,
      supplierPhone,
      supplierDocumentType,
      supplierDocumentNumber,
      supplierPassword,
      supplierAddress,
      observations,
      supplierImage,
      isActive,
      suppliedProducts,
    } = supplierData;

    const query = `
      INSERT INTO suppliers (
        supplier_name,
        supplier_email,
        supplier_phone,
        supplier_document_type,
        supplier_document_number,
        supplier_password,
        supplier_address,
        observations,
        supplier_image,
        is_active,
        supplied_products
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id;
    `;

    const values = [
      supplierName,
      supplierEmail,
      supplierPhone,
      supplierDocumentType,
      supplierDocumentNumber,
      supplierPassword,
      supplierAddress,
      observations || null,
      supplierImage || null,
      isActive,
      JSON.stringify(suppliedProducts || []),
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },
};
