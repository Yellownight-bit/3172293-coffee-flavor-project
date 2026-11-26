
import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Users, ShieldCheck } from "lucide-react";

import { loginSchema } from "@/features/users/schemas/loginSchema";
import { login } from "@/features/auth/services/authService";
import { LoginInput, LoginButton, Checkbox } from "@/shared";
import { showSessionExpiredAlert } from "@/shared/services/alertService";
import SupportContact from "@/features/support/components/SupportContact";

const DATA_POLICY_URL =
  "https://normograma.sena.edu.co/compilacion/docs/acuerdo_sena_0013_2019.htm";

export default function AuthLayout() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("rapido");
  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
    acceptedDataPolicy: false,
  });

  const isLocked = failedAttempts >= 3;

  useEffect(() => {
    if (sessionStorage.getItem("sessionExpired") === "true") {
      sessionStorage.removeItem("sessionExpired");
      showSessionExpiredAlert();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      acceptedDataPolicy: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) return;

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const data = await login({
        ...result.data,
        acceptedDataPolicy: formData.acceptedDataPolicy,
      });

      const userRole = data.rol || data.user?.rol;

      if (!userRole) {
        setErrors({
          userEmail: "No se pudo verificar el rol de tu cuenta.",
        });
        return;
      }

      if (activeTab === "administracion" && userRole !== "administrador") {
        setErrors({
          userEmail: "Esta cuenta no tiene permisos de administrador.",
        });
        return;
      }

      if (activeTab === "rapido" && userRole === "administrador") {
        setErrors({
          userEmail: "Utiliza la pestaña Administración para ingresar.",
        });
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("rol", userRole);

      setFormData({
        userEmail: "",
        userPassword: "",
        acceptedDataPolicy: false,
      });

      navigate("/dashboard/userList");
    } catch (error) {
      const errorMessage =
        error.message || "Correo o contraseña incorrectos";

      if (errorMessage.toLowerCase().includes("política")) {
        setErrors({
          acceptedDataPolicy: errorMessage,
        });
        return;
      }

      const nextAttempt = failedAttempts + 1;
      setFailedAttempts(nextAttempt);

      if (nextAttempt >= 3) {
        setErrors({
          userEmail: "Has agotado los 3 intentos. Recarga la página.",
        });
      } else {
        setErrors({
          userEmail: `${errorMessage}. Intentos restantes: ${3 - nextAttempt}.`,
        });
      }
    }
  };

  return (
    <main className="fixed inset-0 h-dvh w-full overflow-hidden bg-[var(--color-primary-100)] flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-[440px] z-10">
        {/* Panel */}
        <section className="bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] rounded-2xl shadow-lg p-5 sm:p-7">
          {/* Selector de acceso */}
          <div
            className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--color-primary-100)] mb-5"
            role="tablist"
            aria-label="Tipo de acceso"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "rapido"}
              disabled={isLocked}
              onClick={() => {
                setActiveTab("rapido");
                setErrors({});
              }}
              className={`min-h-11 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-700)] disabled:opacity-50 ${
                activeTab === "rapido"
                  ? "bg-[var(--color-primary-50)] text-[var(--color-primary-950)] shadow-sm"
                  : "text-[var(--color-primary-800)] hover:bg-[var(--color-primary-200)]"
              }`}
            >
              <Users size={24} strokeWidth={1.8} />
              Acceso Rápido
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "administracion"}
              disabled={isLocked}
              onClick={() => {
                setActiveTab("administracion");
                setErrors({});
              }}
              className={`min-h-11 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-700)] disabled:opacity-50 ${
                activeTab === "administracion"
                  ? "bg-[var(--color-primary-50)] text-[var(--color-primary-950)] shadow-sm"
                  : "text-[var(--color-primary-800)] hover:bg-[var(--color-primary-200)]"
              }`}
            >
              <ShieldCheck size={24} strokeWidth={1.8} />
              Administración
            </button>
          </div>

          {/* Título */}
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[var(--color-primary-950)]">
              {activeTab === "administracion"
                ? "Acceso administrativo"
                : "Iniciar sesión - Coffee Flavor"}
            </h2>

            <p className="text-sm text-[var(--color-primary-800)] mt-1">
              {activeTab === "administracion"
                ? "Ingresa con tu cuenta de administrador."
                : "Ingresa tus credenciales para continuar."}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate>
            <fieldset
              disabled={isLocked}
              className="border-0 p-0 m-0 min-w-0"
            >
              <LoginInput
                label="Correo electrónico"
                name="userEmail"
                type="email"
                value={formData.userEmail}
                placeholder="Correo electrónico"
                onChange={handleChange}
                error={errors.userEmail}
              />

              <div className="mt-2">
                <LoginInput
                  label="Contraseña"
                  name="userPassword"
                  type="password"
                  value={formData.userPassword}
                  placeholder="Contraseña"
                  onChange={handleChange}
                  error={errors.userPassword}
                />
              </div>

              {/* Política */}
              <div className="mt-5">
                <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--color-primary-800)]">
                  <Checkbox
                    id="acceptedDataPolicy"
                    name="acceptedDataPolicy"
                    label="Acepto la política de tratamiento de datos personales del SENA."
                    checked={formData.acceptedDataPolicy}
                    onChange={handleChange}
                  />

                  <a
                    href={DATA_POLICY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[var(--color-primary-800)] underline underline-offset-2 hover:text-[var(--color-primary-950)] focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Consultar política de tratamiento de datos
                  </a>
                </div>

                {errors.acceptedDataPolicy && (
                  <p className="text-sm text-red-600 mt-2" role="alert">
                    {errors.acceptedDataPolicy}
                  </p>
                )}
              </div>

              {isLocked && (
                <p className="text-sm text-red-600 font-medium mt-4" role="alert">
                  Has agotado los 3 intentos. Recarga la página.
                </p>
              )}

              {/* Recuperación */}
              <div className="flex justify-end mt-4">
                <Link
                  to="/recover-password"
                  onClick={(e) => isLocked && e.preventDefault()}
                  className={`text-sm font-medium text-[var(--color-primary-800)] underline underline-offset-2 hover:text-[var(--color-primary-950)] focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isLocked ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón */}
              <div className="mt-5">
                <LoginButton disabled={isLocked}>
                  {isLocked ? "Bloqueado" : "Iniciar sesión"}
                </LoginButton>
              </div>

              {/* Registro */}
              <div className="text-center mt-5">
                <p className="text-sm text-[var(--color-primary-800)]">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    to="/CreateUserLogin"
                    onClick={(e) => isLocked && e.preventDefault()}
                    className={`font-semibold text-[var(--color-primary-950)] underline underline-offset-2 hover:text-[var(--color-primary-800)] ${
                      isLocked ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    Regístrate
                  </Link>
                </p>
              </div>
            </fieldset>
          </form>
        </section>

        {/* Footer */}
        <footer className="text-center mt-4">
          <p className="text-xs text-[var(--color-primary-800)]">
            Coffee Flavor © 2026 · Todos los derechos reservados
          </p>
        </footer>

        <Outlet />
      </div>

      <SupportContact />
    </main>
  );
}
