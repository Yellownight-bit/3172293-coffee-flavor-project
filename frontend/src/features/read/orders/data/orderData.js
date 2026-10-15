export const mockOrderData = {
  id: "ORD-00001",
  tableNumber: "Mesa 01",
  waiter: "Jacobo Agudelo Lopez",
  status: "Abierta",
  createdAt: "2026-08-09 14:30",
  observations: "Cliente solicita el cafe con azucar y bien fría.",
  items: [
    { id: 1, name: "Café Americano", quantity: 2, price: 3500, total: 7000 },
    { id: 2, name: "Torta de Chocolate", quantity: 1, price: 8500, total: 8500 },
    { id: 3, name: "Capuccino", quantity: 2, price: 7000, total: 14000 },
  ],
  subtotal: 56000,
  total: 56000,
};