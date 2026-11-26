CREATE UNIQUE INDEX IF NOT EXISTS unique_open_order_per_table
ON orders (table_number)
WHERE status = 'Abierta';