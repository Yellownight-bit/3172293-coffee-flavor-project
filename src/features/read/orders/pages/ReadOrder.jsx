import { Button } from "@/shared";
import OrderInfo from "../components/OrderInfo";
import OrderObservations from "../components/OrderObservations";
import OrderItemsList from "../components/OrderItemsList";
import { mockOrderData } from "../data/orderData";
import { useNavigate } from "react-router-dom";
import backgroundImage from "@/assets/images/restaurant.jpg";

export default function ReadOrder() {
  const order = mockOrderData;

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-backgroung flex items-center justify-center p-4 md:p-8 font-sans bg-center bg-cover bg-no-repeat"
    style={{ backgroundImage: `url(${backgroundImage})` }}>
      
      {/* Contenedor Principal */}
      <div className="bg-brand w-full max-w-5xl rounded-3xl p-6 md:p-8 shadow-xl text-text-primary space-y-6">
        
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            ← Atrás
          </Button>
          
          <h1 className="text-main font-heading uppercase tracking-wide text-text-primary">
            VER DETALLE DE ORDEN #{order.id}
          </h1>
        </div>

        {/* Rejilla Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-5 space-y-4">
            <OrderInfo order={order} />
            <OrderObservations observations={order.observations} />
          </div>

          <div className="lg:col-span-7">
            <OrderItemsList 
              items={order.items} 
              subtotal={order.subtotal} 
              total={order.total} 
            />
          </div>

        </div>

        <div className="flex justify-center pt-2">
          <Button 
            type="button"
            onClick={() => navigate("/UpdateOrder")}
            variant="primary">
                ✏️ Editar Orden
          </Button>
        </div>

      </div>

    </div>
  );
}