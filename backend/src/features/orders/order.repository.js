import { pool } from "../../config/db.js";

export const orderRepository = {
  async create(orderData) {
    const {
      tableNumber,
      waiter,
      dishes,
      observations,
      status,
    } = orderData;

    const query = `
      INSERT INTO orders (
        table_number,
        waiter_id,
        dishes,
        observations,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;

    const values = [
      Number(tableNumber),
      Number(waiter),
      JSON.stringify(
        dishes.map((dish) => ({
          productId: Number(dish.productId),
          quantity: Number(dish.quantity),
        }))
      ),
      observations || null,
      status || "Abierta",
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },
};