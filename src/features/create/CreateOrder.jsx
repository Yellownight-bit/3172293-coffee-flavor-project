import { useState, useEffect } from "react";
import { Select, Button } from "@/shared";
import { getOrderTables } from "@/services/selectOrderService";
import { getOrderUsers } from "@/services/selectUserService";
import { getOrderProducts } from "@/services/selectOrderProductService";
import Navbar from "@/shared/layouts/Navbar";
import { useNavigate } from "react-router-dom";
import backgroundImage from "@/assets/images/restaurant.jpg";

export default function CreateOrder() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [tables, setTables] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    tableNumber: "",
    waiter: "",
    dishes: [
      {
        productId: "",
        quantity: 1,
      },
    ],
    observations: "",
    status: "Abierta",
  });

  // Obtener mesas
  useEffect(() => {
    getOrderTables().then(setTables);
  }, []);

  // Obtener meseros
  useEffect(() => {
    getOrderUsers().then(setUsers);
  }, []);

  // Obtener productos
  useEffect(() => {
    getOrderProducts().then(setProducts);
  }, []);

  // Cambios de mesa, mesero y observaciones
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cambiar producto o cantidad
  const handleDishChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDishes = [...prev.dishes];

      updatedDishes[index] = {
        ...updatedDishes[index],
        [field]: value,
      };

      return {
        ...prev,
        dishes: updatedDishes,
      };
    });
  };

  // Agregar otro platillo
  const addDish = () => {
    setFormData((prev) => ({
      ...prev,
      dishes: [
        ...prev.dishes,
        {
          productId: "",
          quantity: 1,
        },
      ],
    }));
  };

  // Eliminar platillo
  const removeDish = (index) => {
    setFormData((prev) => ({
      ...prev,
      dishes: prev.dishes.filter((_, i) => i !== index),
    }));
  };

  // Enviar formulario
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
        !dish.quantity ||
        dish.quantity < 1
    );

    if (hasEmptyDish) {
      newErrors.dishes =
        "Seleccione un platillo y una cantidad válida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      console.log("Orden creada:", formData);

      alert("Orden creada correctamente");

      navigate("/dashboard/orderList");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Contenedor principal */}
      <div className="flex-1 p-4 flex items-center justify-center">

        <div className="w-full max-w-6xl bg-gradient-to-b from-[var(--color-primary-800)] to-[#fcdfa6] rounded-3xl p-8 shadow-md relative">

          {/* Botón atrás */}
          <button
            type="button"
            className="absolute top-6 left-6 bg-[var(--color-primary-950)] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-[var(--color-primary-900)] transition"
            onClick={() => navigate("/dashboard/orderList")}
          >
            <span>←</span> Atrás
          </button>

          {/* Título */}
          <div className="flex items-center gap-2 mt-8 mb-6 border-b border-[var(--color-primary-950)]/30 pb-3">

            <div className="text-2xl text-[var(--color-primary-950)]">
              🧾
              <span className="font-bold text-xl relative -top-2 -left-1">
                +
              </span>
            </div>

            <h2 className="text-[var(--color-primary-950)] font-bold text-xl uppercase tracking-wider">
              Crear Orden
            </h2>

          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Mesa y mesero */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <Select
                label="Número de mesa"
                name="tableNumber"
                value={formData.tableNumber}
                htmlFor="tableNumber"
                onChange={handleChange}
                options={tables}
                error={errors.tableNumber}
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

            {/* Platillos */}
            <div className="bg-[var(--color-primary-100)] p-5 rounded-2xl border border-[var(--color-primary-200)]">

              {/* Título y botón agregar */}
              <div className="flex items-center justify-between mb-5">

                <h3 className="font-bold text-gray-700 uppercase text-sm">
                  Platillos de la orden
                </h3>

                <button
                  type="button"
                  onClick={addDish}
                  className="text-sm font-semibold text-[var(--color-primary-950)] hover:underline"
                >
                  + Agregar platillo
                </button>

              </div>

              {/* Lista de platillos */}
              <div className="space-y-4">

                {formData.dishes.map((dish, index) => (

                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_100px_45px] gap-4 items-end"
                  >

                    {/* Platillo */}
                    <Select
                      label={`Platillo ${index + 1}`}
                      name={`product-${index}`}
                      value={dish.productId}
                      htmlFor={`product-${index}`}
                      onChange={(e) =>
                        handleDishChange(
                          index,
                          "productId",
                          e.target.value
                        )
                      }
                      options={products}
                    />

                    {/* Cantidad */}
                    <div className="w-[100px] max-w-full">
                    <label
                        htmlFor={`quantity-${index}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Cantidad
                    </label>

                    <input
                        id={`quantity-${index}`}
                        name={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={dish.quantity}
                        onChange={(e) =>
                        handleDishChange(
                            index,
                            "quantity",
                            Number(e.target.value)
                        )
                        }
                        className="w-full h-10 rounded-xl border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-700)]"
                    />
                    </div>

                    {/* Eliminar */}
                    {formData.dishes.length > 1 && (

                      <button
                        type="button"
                        onClick={() => removeDish(index)}
                        className="h-10 w-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-bold"
                        title="Eliminar platillo"
                      >
                        🗑️
                      </button>

                    )}

                  </div>

                ))}

              </div>

              {/* Error de platillos */}
              {errors.dishes && (
                <p className="text-red-600 text-sm mt-3">
                  {errors.dishes}
                </p>
              )}

            </div>

            {/* Observaciones */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observaciones especiales
              </label>

              <textarea
                name="observations"
                rows={4}
                value={formData.observations}
                onChange={handleChange}
                placeholder="Escriba observaciones especiales de la orden..."
                className="w-full rounded-xl border border-gray-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-700)]"
              />

            </div>

            {/* Botones */}
            <div className="pt-6 border-[var(--color-primary-950)]/20 flex flex-col sm:flex-row justify-end items-center gap-4">

              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => navigate("/dashboard/orderList")}
                className="px-6 py-2 rounded-full font-semibold border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                size="md"
                type="submit"
                className="px-8 py-2 rounded-full font-semibold bg-[var(--color-primary-950)] hover:bg-[var(--color-primary-900)] text-white shadow-md transition"
              >
                Crear orden
              </Button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}