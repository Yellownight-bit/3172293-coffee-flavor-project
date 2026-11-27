
import { useState, useEffect } from "react";
import { Select, Button } from "@/shared";
import { getOrderTables } from "@/services/selectOrderService";
import { getOrderUsers } from "@/services/selectUserService";
import { getOrderProducts } from "@/services/selectOrderProductService";
import {
  getAllOrders,
  updateOrder,
} from "@/features/order/services/orderServices.js";
import OrderProductSelector from "@/features/order/components/OrderProductSelector";
import TableSelector from "@/features/order/components/TableSelector";
import Navbar from "@/shared/layouts/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import backgroundImage from "@/assets/images/restaurant.jpg";
import {
  showSuccessAlert,
  showUserErrorAlert,
  showConfirmDiscardAlert,
  showConfirmRemoveProductAlert,
} from "@/shared/services/alertService";

export default function UpdateOrder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [tables, setTables] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    tableNumber: "",
    waiter: "",
    dishes: [],
    observations: "",
    status: "Abierta",
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [
          tableOptions,
          userOptions,
          productOptions,
          orderOptions,
        ] = await Promise.all([
          getOrderTables(),
          getOrderUsers(),
          getOrderProducts(),
          getAllOrders(),
        ]);

        setTables(tableOptions);
        setUsers(userOptions);
        setProducts(productOptions);
        setOrders(orderOptions);
      } catch (error) {
        console.error("Error al cargar opciones:", error);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);

        const orders = await getAllOrders();

        const order = orders.find(
          (item) => Number(item.id) === Number(id)
        );

        if (!order) {
          await showUserErrorAlert({
            title: "Orden no encontrada",
            text: `No se encontró la orden con ID ${id}.`,
          });

          navigate("/dashboard/orderList");
          return;
        }

        let dishes = order.dishes;

        if (typeof dishes === "string") {
          dishes = JSON.parse(dishes);
        }

        dishes = Array.isArray(dishes) ? dishes : [];

        setFormData({
          tableNumber: String(order.table_number ?? ""),
          waiter: String(order.waiter_id ?? ""),
          dishes: dishes.map((dish) => ({
            productId: String(dish.productId ?? ""),
            quantity: Number(dish.quantity ?? 1),
          })),
          observations: order.observations ?? "",
          status: order.status ?? "Abierta",
        });
      } catch (error) {
        console.error("Error al cargar la orden:", error);

        await showUserErrorAlert({
          title: "Error al cargar la orden",
          text: error.message || "No fue posible consultar la orden.",
        });

        navigate("/dashboard/orderList");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTableChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      tableNumber: value,
    }));

    setErrors((prev) => ({
      ...prev,
      tableNumber: "",
    }));
  };

  const addProduct = (productId) => {
    setFormData((prev) => {
      const existingDish = prev.dishes.find(
        (dish) => String(dish.productId) === String(productId)
      );

      if (existingDish) {
        return {
          ...prev,
          dishes: prev.dishes.map((dish) =>
            String(dish.productId) === String(productId)
              ? {
                  ...dish,
                  quantity: Number(dish.quantity) + 1,
                }
              : dish
          ),
        };
      }

      return {
        ...prev,
        dishes: [
          ...prev.dishes,
          {
            productId: String(productId),
            quantity: 1,
          },
        ],
      };
    });

    setErrors((prev) => ({
      ...prev,
      dishes: "",
    }));
  };

  const changeProductQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setFormData((prev) => ({
      ...prev,
      dishes: prev.dishes.map((dish) =>
        String(dish.productId) === String(productId)
          ? { ...dish, quantity }
          : dish
      ),
    }));
  };

  const removeProduct = async (productId) => {
    const result = await showConfirmRemoveProductAlert({
    text: "El producto se eliminará de la orden que estás actualizando.",
  });

    if (!result.isConfirmed) return;

    setFormData((prev) => ({
      ...prev,
      dishes: prev.dishes.filter(
        (dish) => String(dish.productId) !== String(productId)
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.tableNumber) {
      newErrors.tableNumber = "Seleccione una mesa";
    }

    if (!formData.waiter) {
      newErrors.waiter = "Seleccione un mesero";
    }

    if (formData.dishes.length === 0) {
      newErrors.dishes = "Debe agregar al menos un platillo";
    }

    const hasEmptyDish = formData.dishes.some(
      (dish) =>
        !dish.productId ||
        !Number.isInteger(Number(dish.quantity)) ||
        Number(dish.quantity) < 1
    );

    if (hasEmptyDish) {
      newErrors.dishes =
        "Seleccione un platillo y una cantidad válida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      await showUserErrorAlert({
        title: "Error al actualizar orden",
        text: "Hay campos vacíos o datos incorrectos. Por favor, verifica la información ingresada.",
      });

      return;
    }

    setErrors({});

    try {
      const orderData = {
        tableNumber: Number(formData.tableNumber),
        waiter: Number(formData.waiter),
        dishes: formData.dishes.map((dish) => ({
          productId: Number(dish.productId),
          quantity: Number(dish.quantity),
        })),
        observations: formData.observations,
        status: formData.status,
      };

      await updateOrder(id, orderData);

      await showSuccessAlert({
        title: "Orden actualizada correctamente",
        text: "Se actualizó la orden correctamente.",
        confirmButtonText: "Aceptar",
        timer: 3000,
      });

      navigate("/dashboard/orderList");
    } catch (error) {
      console.error("Error al actualizar orden:", error);

      await showUserErrorAlert({
        title: "Error al actualizar orden",
        text: error.message || "No fue posible actualizar la orden.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-text-primary">
        Cargando información de la orden...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-center bg-cover bg-no-repeat bg-image-themed"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Navbar />

      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="w-full max-w-6xl bg-gradient-to-b from-gradient-start to-gradient-end rounded-3xl p-8 shadow-md relative">
          <Button
            variant="back"
            size="back"
            type="button"
            onClick={async () => {
              const result = await showConfirmDiscardAlert({
                title: "¿Deseas salir de la actualización de la orden?",
                text: "Si realizas esta acción, no se guardarán los cambios realizados.",
              });

              if (result.isConfirmed) {
                navigate("/dashboard/orderList");
              }
            }}
          >
            <span>←</span> Atrás
          </Button>

          <div className="flex items-center gap-2 mt-8 mb-6 border-b border-brand-strong/30 pb-3">
            <div className="text-2xl text-brand-strong">
              🧾
              <span className="font-bold text-xl relative -top-2 -left-1">
                ✎
              </span>
            </div>

            <h2 className="text-brand-strong font-bold text-xl uppercase tracking-wider">
              Actualizar Orden #{id}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <TableSelector
                tables={tables}
                orders={orders}
                users={users}
                value={formData.tableNumber}
                onChange={handleTableChange}
                error={errors.tableNumber}
                currentOrderId={id}
              />

              <Select
                label="Mesero responsable"
                name="waiter"
                value={formData.waiter}
                htmlFor="waiter"
                onChange={handleChange}
                options={users}
                error={errors.waiter}
              />
            </div>

            <div className="bg-brand-subtle p-5 rounded-2xl border border-brand-soft">
              <OrderProductSelector
                products={products}
                dishes={formData.dishes}
                onAddProduct={addProduct}
                onQuantityChange={changeProductQuantity}
                onRemoveProduct={removeProduct}
              />

              {errors.dishes && (
                <p className="text-error text-sm mt-3">
                  {errors.dishes}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Observaciones especiales
              </label>

              <textarea
                name="observations"
                rows={4}
                value={formData.observations}
                onChange={handleChange}
                placeholder="Escriba observaciones especiales de la orden..."
                className="w-full rounded-xl border border-border-soft p-3 resize-none focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>

            <div className="pt-6 border-brand-strong/20 flex flex-col sm:flex-row justify-end items-center gap-4">
              <Button
                variant="cancel"
                size="cancel"
                type="button"
                onClick={async () => {
                  const result = await showConfirmDiscardAlert({
                    title: "¿Deseas cancelar la actualización de la orden?",
                    text: "Si realizas esta acción, no se guardarán los cambios realizados.",
                  });

                  if (result.isConfirmed) {
                    navigate("/dashboard/orderList");
                  }
                }}
              >
                Cancelar
              </Button>

              <Button
                variant="finish"
                size="finish"
                type="submit"
              >
                Actualizar orden
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
