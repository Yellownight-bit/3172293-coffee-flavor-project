import { Button } from "@/shared";
import { DetailItem } from "@/shared";
import Nicolas from "@/assets/images/users/nicolas.png";

export default function ReadUser() {
  const user = {
    userName: "Nicolas Echeverry",
    userImage: Nicolas,
    documentType: "Cédula de ciudadanía",
    documentNumber: "1054321098",
    userType: "Empleado",
    userEmail: "nicoconuna16@example.com",
    institutionalEmail: "nicolas.echeverry@sena.edu.co",
    userPhone: "3129876543",
    secondPhone: "3124567890",
    address: "Santa Rosa de Cabal, Risaralda",
    startDate: "22/01/2026",
    endDate: "Sin definir",
    status: "Activo",
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">

      <div className="flex-1 p-6 flex justify-center items-center">

        <div className="w-full max-w-6xl bg-gradient-to-b from-[var(--color-primary-800)] to-[#fcdfa6] rounded-3xl shadow-lg p-8 relative">

          {/* Botón atrás */}

          <Button
            variant="secondary"
            size="sm"
            type="button"
            className="mt-2 border-2 border-[var(--color-primary-950)] rounded-full px-4 py-2 hover:bg-white transition duration-300"
            onClick={() => console.log("Atrás")}
          >
            ← Atrás
          </Button>

          {/* Encabezado */}

          <div className="flex items-center gap-3 mb-8 mt-8 border-b border-[var(--color-primary-950)] pb-3">

            <div className="text-4xl">
              👤
            </div>

            <h2 className="text-2xl font-bold uppercase text-[var(--color-primary-950)]">
              Perfil de Usuario
            </h2>

          </div>

          {/* Contenido */}

          <div className="grid md:grid-cols-2 gap-10">

            {/* Panel izquierdo */}

            <div className="flex flex-col items-center">

              <div className="w-64 h-72 rounded-xl overflow-hidden border-4 border-white shadow-md">

                <img
                  src={user.userImage}
                  alt={user.userName}
                  className="w-full h-full object-cover"
                />

              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-800">
                {user.userName}
              </h3>

              <div className="w-full border-b border-[var(--color-primary-950)] my-5" />

              <div className="flex items-center gap-3">

                <span className="font-semibold">
                  Estado
                </span>

                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {user.status}
                </span>

              </div>

              <Button
                variant="primary"
                size="md"
                type="button"
                className="mt-8 border-2 border-[var(--color-primary-950)] rounded-full px-8 py-2 hover:bg-white transition duration-300"
                onClick={() => console.log("Editar usuario")}
                >
                ✏ Editar
                </Button>

            </div>

            {/* Panel derecho */}

            <div className="bg-white rounded-2xl shadow-md p-8">

              <DetailItem
                label="Tipo de documento"
                value={user.documentType}
              />

              <DetailItem
                label="Número de documento"
                value={user.documentNumber}
              />

              <DetailItem
                label="Tipo de usuario"
                value={user.userType}
              />

              <DetailItem
                label="Correo electrónico"
                value={user.userEmail}
              />

              <DetailItem
                label="Correo institucional"
                value={user.institutionalEmail}
              />

              <DetailItem
                label="Número telefónico"
                value={user.userPhone}
              />

              <DetailItem
                label="Segundo teléfono"
                value={user.secondPhone}
              />

              <DetailItem
                label="Dirección"
                value={user.address}
              />

              <DetailItem
                label="Fecha inicio"
                value={user.startDate}
              />

              <DetailItem
                label="Fecha fin"
                value={user.endDate}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}