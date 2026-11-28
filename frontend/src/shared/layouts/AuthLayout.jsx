// Layout de inicio de sesión
// - Colores solo con tokens del tema (claro/oscuro) y contraste accesible.
// - Sin scroll en escritorio (el contenido cabe); en pantallas pequeñas se permite bajar.
// - Selector de acceso como botones segmentados (aria-pressed).
// - Usa los componentes del sistema: Input (con ícono y ver contraseña), Button y Checkbox.
// La lógica de inicio de sesión (handleSubmit, intentos y roles) no se modifica.
import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Users, ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

import { loginSchema } from "@/features/users/schemas/loginSchema";
import { login } from "@/features/auth/services/authService";
import { Input, Button, Checkbox } from "@/shared";
import { showSessionExpiredAlert } from "@/shared/services/alertService";
import SupportContact from "@/features/support/components/SupportContact";

const DATA_POLICY_URL =
  "https://normograma.sena.edu.co/compilacion/docs/acuerdo_sena_0013_2019.htm";

// Opciones del selector de acceso
const ACCESS_OPTIONS = [
  { value: "rapido", label: "Acceso Rápido", icon: Users },
  { value: "administracion", label: "Administración", icon: ShieldCheck },
];

const linkStyles =
  "rounded-sm text-text-primary underline underline-offset-2 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring";

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
    <main className="flex min-h-dvh w-full items-center justify-center overflow-y-auto bg-background p-4 sm:p-6">
      <div className="relative z-10 w-full max-w-[440px]">
        {/* Panel */}
        <section className="rounded-2xl border border-border-soft bg-panel p-5 shadow-lg sm:p-7">
          {/* Selector de acceso (botones segmentados) */}
          <div
            role="group"
            aria-label="Tipo de acceso"
            className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-panel-muted p-1"
          >
            {ACCESS_OPTIONS.map(({ value, label, icon: Icon }) => {
              const selected = activeTab === value;

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  disabled={isLocked}
                  onClick={() => {
                    setActiveTab(value);
                    setErrors({});
                  }}
                  className={`
                    flex min-h-12 items-center justify-center gap-2 rounded-full px-3
                    text-medium font-medium transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${selected
                      ? "bg-brand-soft text-text-primary shadow-sm"
                      : "text-text-secondary enabled:hover:bg-panel"}
                  `}
                >
                  <Icon aria-hidden="true" strokeWidth={1.8} className="size-5" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Título */}
          <div className="mb-5">
            <h1 className="font-heading text-title text-text-primary">
              {activeTab === "administracion"
                ? "Acceso administrativo"
                : "Iniciar sesión - Coffee Flavor"}
            </h1>

            <p className="mt-1 text-medium text-text-secondary">
              {activeTab === "administracion"
                ? "Ingresa con tu cuenta de administrador."
                : "Ingresa tus credenciales para continuar."}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate>
            <fieldset disabled={isLocked} className="m-0 min-w-0 space-y-4 border-0 p-0">
              <Input
                label="Correo electrónico"
                name="userEmail"
                type="email"
                autoComplete="email"
                leadingIcon={Mail}
                value={formData.userEmail}
                placeholder="Correo electrónico"
                onChange={handleChange}
                error={errors.userEmail}
              />

              <Input
                label="Contraseña"
                name="userPassword"
                type="password"
                autoComplete="current-password"
                leadingIcon={Lock}
                value={formData.userPassword}
                placeholder="Contraseña"
                onChange={handleChange}
                error={errors.userPassword}
              />

              {/* Política de datos */}
              <div>
                <Checkbox
                  id="acceptedDataPolicy"
                  name="acceptedDataPolicy"
                  label="Acepto la política de tratamiento de datos personales del SENA."
                  checked={formData.acceptedDataPolicy}
                  onChange={handleChange}
                  aria-describedby={errors.acceptedDataPolicy ? "policy-error" : undefined}
                  className="text-text-primary"
                />

                <a
                  href={DATA_POLICY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-small font-medium ${linkStyles}`}
                >
                  Consultar política de tratamiento de datos
                </a>

                {errors.acceptedDataPolicy && (
                  <p id="policy-error" role="alert" className="mt-2 text-small text-error">
                    {errors.acceptedDataPolicy}
                  </p>
                )}
              </div>

              {isLocked && (
                <p role="alert" className="text-medium font-medium text-error">
                  Has agotado los 3 intentos. Recarga la página.
                </p>
              )}

              {/* Recuperación */}
              <div className="flex justify-end">
                <Link
                  to="/recover-password"
                  onClick={(e) => isLocked && e.preventDefault()}
                  aria-disabled={isLocked || undefined}
                  className={`text-medium font-medium ${linkStyles} ${
                    isLocked ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón principal */}
              <Button type="submit" size="lg" disabled={isLocked} className="w-full">
                {isLocked ? "Bloqueado" : "Iniciar sesión"}
                <ArrowRight aria-hidden="true" className="size-5" />
              </Button>

              {/* Registro */}
              <p className="text-center text-medium text-text-secondary">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/CreateUserLogin"
                  onClick={(e) => isLocked && e.preventDefault()}
                  aria-disabled={isLocked || undefined}
                  className={`font-semibold ${linkStyles} ${
                    isLocked ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Regístrate
                </Link>
              </p>
            </fieldset>
          </form>
        </section>

        {/* Pie */}
        <footer className="mt-4 text-center">
          <p className="text-small text-text-secondary">
            Coffee Flavor © 2026 · Todos los derechos reservados
          </p>
        </footer>

        <Outlet />
      </div>

      <SupportContact />
    </main>
  );
}