
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  FileText,
  CalendarDays,
  ShieldCheck,
  BriefcaseBusiness,
  Pencil,
  ArrowLeft,
  CircleCheck,
  CircleX,
  Save,
  Headset,
} from "lucide-react";

import { Button } from "@/shared";
import { getMyProfile } from "../services/userServices.js";
import { API_URL } from "@/features/config";
import SupportContact from "@/features/support/components/SupportContact";

export default function MyProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [supportEmail, setSupportEmail] = useState("");
  const [savingSupportEmail, setSavingSupportEmail] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportError, setSupportError] = useState("");

  const isAdmin = sessionStorage.getItem("rol") === "administrador";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const userData = await getMyProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const loadSupportEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/support`);

        if (!response.ok) {
          throw new Error("No se pudo consultar el correo de soporte");
        }

        const data = await response.json();
        setSupportEmail(data.support_email || "");
      } catch (error) {
        console.error("Error al consultar el correo de soporte:", error);
        setSupportError("No fue posible cargar el correo de soporte.");
      }
    };

    loadSupportEmail();
  }, [isAdmin]);

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) return image;

    const serverUrl = API_URL.replace(/\/api\/?$/, "");

    return `${serverUrl}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const getUserType = () => {
    if (user?.rol) {
      return user.rol.charAt(0).toUpperCase() + user.rol.slice(1);
    }

    return "Sin rol asignado";
  };

  const formatDate = (date) => {
    if (!date) return "Sin registrar";

    return new Date(date).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const profileImage = getImageUrl(user?.user_image);

  const handleEdit = () => {
    navigate(`/UpdateUser/${user.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleUpdateSupportEmail = async (e) => {
    e.preventDefault();

    setSupportMessage("");
    setSupportError("");

    const normalizedEmail = supportEmail.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setSupportError("Ingresa un correo electrónico válido.");
      return;
    }

    try {
      setSavingSupportEmail(true);

      const token = sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/support`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supportEmail: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.message ||
          "No fue posible actualizar el correo de soporte."
        );
      }

      setSupportEmail(data.settings?.support_email || normalizedEmail);
      setSupportMessage("Correo de soporte actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el correo de soporte:", error);
      setSupportError(error.message);
    } finally {
      setSavingSupportEmail(false);
    }
  };

  const profileDetails = [
    {
      label: "Tipo de documento",
      value: user?.user_document_types,
      icon: FileText,
    },
    {
      label: "Número de documento",
      value: user?.user_document_number,
      icon: ShieldCheck,
    },
    {
      label: "Correo electrónico",
      value: user?.user_email,
      icon: Mail,
    },
    {
      label: "Número telefónico",
      value: user?.user_phone,
      icon: Phone,
    },
    {
      label: "Dirección",
      value: user?.user_address,
      icon: MapPin,
    },
    {
      label: "Fecha de registro",
      value: formatDate(user?.created_at),
      icon: CalendarDays,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-panel/80 text-text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-border border-t-brand animate-spin" />
          <p className="text-sm font-medium text-text-secondary">
            Cargando tu perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-panel/80 text-text-primary p-6">
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center">
          <UserRound size={32} className="text-text-secondary" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold">
            No fue posible cargar tu perfil
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Ocurrió un problema al consultar tu información.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate("/HomePage")}
        >
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-panel/80 backdrop-blur-md text-text-primary p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Encabezado */}
        <div className="mb-6">
          <Button
            size="sm"
            variant="primary"
            onClick={handleBack}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Atrás
            </span>
          </Button>

          <div className="mt-6">
            <p className="text-sm font-semibold text-brand uppercase tracking-wider">
              Cuenta personal
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              Mi perfil
            </h1>

            <p className="text-sm text-text-secondary mt-2">
              Consulta tu información personal y los datos de tu cuenta.
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Tarjeta de presentación */}
          <section className="lg:col-span-1">
            <div className="h-full rounded-2xl border border-border bg-surface shadow-md p-6 flex flex-col items-center">

              <div className="w-36 h-36 rounded-full border-4 border-border overflow-hidden flex items-center justify-center bg-panel shadow-sm">
                {profileImage && !imageError ? (
                  <img
                    src={profileImage}
                    alt={`Fotografía de ${user.user_name}`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-4xl font-bold text-text-secondary">
                    {getInitials(user.user_name)}
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-xl font-bold text-center break-words">
                {user.user_name}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {getUserType()}
              </p>

              <div className="w-full border-t border-border my-6" />

              {/* Estado de la cuenta */}
              <div className="w-full flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">
                  Estado de la cuenta
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.is_active ? (
                    <CircleCheck size={14} />
                  ) : (
                    <CircleX size={14} />
                  )}

                  {user.is_active ? "Activa" : "Inactiva"}
                </span>
              </div>

              <div className="w-full border-t border-border my-5" />

              {/* Tipo de cuenta */}
              <div className="w-full flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-panel flex items-center justify-center shrink-0">
                  <BriefcaseBusiness
                    size={19}
                    className="text-brand"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-text-secondary">
                    Tipo de usuario
                  </p>
                  <p className="text-sm font-semibold">
                    {getUserType()}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-8 w-full flex justify-center">
                <div className="w-fit">
                  <Button
                    size="md"
                    variant="primary"
                    onClick={handleEdit}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Pencil size={16} />
                      Editar mi información
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Información personal */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-surface shadow-md p-6 sm:p-8 h-full">

              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl bg-panel flex items-center justify-center">
                  <UserRound size={21} className="text-brand" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Información personal
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Datos registrados en Coffee Flavor
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                {profileDetails.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.label}
                      className="flex items-start gap-3 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-xl bg-panel flex items-center justify-center shrink-0">
                        <Icon
                          size={18}
                          className="text-brand"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-text-secondary mb-1">
                          {detail.label}
                        </p>

                        <p className="text-sm font-semibold break-words">
                          {detail.value || "Sin registrar"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nota informativa */}
              <div className="mt-9 rounded-xl border border-border bg-panel/70 p-4 flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="text-brand shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Información de tu cuenta
                  </p>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">
                    Puedes actualizar tus datos personales desde la opción
                    "Editar mi información". Mantén tus datos actualizados
                    para facilitar la gestión de tu cuenta.
                  </p>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* Configuración del correo de soporte: solo administrador */}
        {isAdmin && (
          <section className="mt-6">
            <div className="rounded-2xl border border-border bg-surface shadow-md p-6 sm:p-8">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-panel flex items-center justify-center">
                  <Headset size={21} className="text-brand" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Correo de soporte
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Configura el correo al que los usuarios podrán escribir
                    cuando necesiten ayuda.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateSupportEmail}>
                <label
                  htmlFor="supportEmail"
                  className="block text-sm font-semibold mb-2"
                >
                  Correo electrónico de soporte
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => {
                      setSupportEmail(e.target.value);
                      setSupportMessage("");
                      setSupportError("");
                    }}
                    placeholder="soporte@coffeeflavor.com"
                    required
                    className="w-full min-w-0 rounded-xl border border-border bg-panel px-4 py-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                  />

                  <button
                    type="submit"
                    disabled={savingSupportEmail}
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={17} />
                    {savingSupportEmail ? "Guardando..." : "Guardar"}
                  </button>
                </div>

                {supportMessage && (
                  <p className="mt-3 text-sm font-medium text-green-700">
                    {supportMessage}
                  </p>
                )}

                {supportError && (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    {supportError}
                  </p>
                )}
              </form>

            </div>
          </section>
        )}

      </div>

      {/* Contacto de soporte visible para todos */}
      <SupportContact />
    </div>
  );
}
