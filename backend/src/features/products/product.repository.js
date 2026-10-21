import { pool } from "../../config/db.js";

export const productRepository = {
  async create(productData) {
    const {
      productName,
      productCategory,
      productPrice,
      productDescription,
      productId,
      productSupplierNames,
      productQuantity,
      shippingDate,
      nuevo,
      incluido,
      agotable,
      oferta,
      envio,
      activo,
      destacado,
      importado,
      devoluciones,
      productImage,
    } = productData;

    const query = `
      INSERT INTO products (
        product_name,
        product_category,
        product_price,
        product_description,
        product_code,
        product_supplier_names,
        product_quantity,
        shipping_date,
        nuevo,
        incluido,
        agotable,
        oferta,
        envio,
        activo,
        destacado,
        importado,
        devoluciones,
        product_image
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17, $18
      )
      RETURNING id;
    `;

    const values = [
      productName,
      productCategory,
      Number(productPrice),
      productDescription || null,
      productId,
      productSupplierNames || null,
      Number(productQuantity || 0),
      shippingDate || null,
      nuevo ?? false,
      incluido ?? false,
      agotable ?? false,
      oferta ?? false,
      envio ?? false,
      activo ?? true,
      destacado ?? false,
      importado ?? false,
      devoluciones ?? false,
      productImage || null,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },
};