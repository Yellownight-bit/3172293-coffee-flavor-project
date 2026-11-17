
import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Users, ShieldCheck } from "lucide-react";

import coffeeLogo from "@/assets/images/1-logo.png";
import { loginSchema } from "@/features/users/schemas/loginSchema";
import { login } from "@/features/auth/services/authService";
import { LoginInput, LoginButton } from "@/shared";

export default function AuthLayout() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("rapido");
  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const isLocked = failedAttempts >= 3;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
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
      const data = await login(result.data);
      console.log("RESPUESTA DEL LOGIN:", data);

      const userRole = data.rol || data.user?.rol;

      if (!userRole) {
        setErrors({
          userEmail: "No se pudo verificar el rol de tu cuenta.",
        });
        return;
      }

      if (
        activeTab === "administracion" &&
        userRole !== "administrador"
      ) {
        setErrors({
          userEmail: "Esta cuenta no tiene permisos de administrador.",
        });
        return;
      }

      if (
        activeTab === "rapido" &&
        userRole === "administrador"
      ) {
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
      });

      navigate("/dashboard/userList");

    } catch (error) {
      const nextAttempt = failedAttempts + 1;

      setFailedAttempts(nextAttempt);

      if (nextAttempt >= 3) {
        setErrors({
          userEmail: "Has agotado los 3 intentos. Recarga la página.",
        });
      } else {
        setErrors({
          userEmail: `${
            error.message || "Correo o contraseña incorrectos"
          }. Intentos restantes: ${3 - nextAttempt}.`,
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[var(--color-primary-100)] flex flex-col items-center justify-center px-5 py-8">

      <style>
        {`
          html {
            scrollbar-width: none;
          }

          body {
            scrollbar-width: none;
          }

          body::-webkit-scrollbar,
          html::-webkit-scrollbar {
            display: none;
          }

          @keyframes coffeeFloat {
            0% {
              transform: translateY(110vh) rotate(0deg);
            }
            100% {
              transform: translateY(-120px) rotate(720deg);
            }
          }

          .coffee-bean {
            position: absolute;
            width: 19px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(
              135deg,
              var(--color-primary-800),
              var(--color-primary-950)
            );
            box-shadow: inset 3px 2px 5px var(--color-primary-500);
            opacity: 0.35;
            animation: coffeeFloat linear infinite;
            pointer-events: none;
          }

          .coffee-bean::after {
            content: "";
            position: absolute;
            width: 2px;
            height: 23px;
            background: var(--color-primary-300);
            border-radius: 50%;
            left: 9px;
            top: 3px;
            transform: rotate(12deg);
          }
        `}
      </style>

      {/* Fondo animado de granos de café */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="coffee-bean left-[8%]" style={{ animationDuration: "18s", animationDelay: "-5s" }} />
        <span className="coffee-bean left-[22%]" style={{ animationDuration: "24s", animationDelay: "-12s" }} />
        <span className="coffee-bean left-[38%]" style={{ animationDuration: "20s", animationDelay: "-8s" }} />
        <span className="coffee-bean left-[55%]" style={{ animationDuration: "26s", animationDelay: "-15s" }} />
        <span className="coffee-bean left-[72%]" style={{ animationDuration: "19s", animationDelay: "-3s" }} />
        <span className="coffee-bean left-[88%]" style={{ animationDuration: "23s", animationDelay: "-10s" }} />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-[500px]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <img
            src={coffeeLogo}
            alt="Coffee Flavor Restaurant"
            className="w-40 h-40 object-contain"
          />

          <p className="text-black font-medium text-sm tracking-wide">
            Sistema de Gestión Administrativa
          </p>
        </div>

        {/* Panel de inicio de sesión */}
        <div className="bg-[var(--color-primary-50)]/95 border border-[var(--color-primary-200)] rounded-[28px] shadow-xl p-7 sm:p-9">

          {/* Pestañas */}
          <div className="flex rounded-full border border-[var(--color-primary-700)] overflow-hidden mb-8">

            <button
              type="button"
              disabled={isLocked}
              onClick={() => {
                setActiveTab("rapido");
                setErrors({});
              }}
              className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                activeTab === "rapido"
                  ? "bg-[var(--color-primary-700)] text-white"
                  : "bg-transparent text-[var(--color-primary-950)] hover:bg-[var(--color-primary-100)]"
              }`}
            >
              <Users size={18} />
              Acceso Rápido
            </button>

            <button
              type="button"
              disabled={isLocked}
              onClick={() => {
                setActiveTab("administracion");
                setErrors({});
              }}
              className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                activeTab === "administracion"
                  ? "bg-[var(--color-primary-700)] text-white"
                  : "bg-transparent text-[var(--color-primary-950)] hover:bg-[var(--color-primary-100)]"
              }`}
            >
              <ShieldCheck size={18} />
              Administración
            </button>

          </div>

          {/* Información del acceso */}
          <div className="text-center mb-7">
            <h1 className="text-xl font-bold text-[var(--color-primary-950)]">
              {activeTab === "administracion"
                ? "Acceso Administrativo"
                : "Acceso al Sistema"}
            </h1>

            <p className="text-[var(--color-primary-800)] text-sm mt-2">
              {activeTab === "administracion"
                ? "Ingresa tus credenciales de administrador."
                : "Ingresa tus credenciales para acceder al sistema."}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <fieldset
              disabled={isLocked}
              className="border-0 p-0 m-0 min-w-0"
            >

              <LoginInput
                label="Correo electrónico"
                name="userEmail"
                type="email"
                value={formData.userEmail}
                placeholder="Ingresa tu correo electrónico"
                onChange={handleChange}
                error={errors.userEmail}
              />

              <div className="mt-5">
                <LoginInput
                  label="Contraseña"
                  name="userPassword"
                  type="password"
                  value={formData.userPassword}
                  placeholder="Ingresa tu contraseña"
                  onChange={handleChange}
                  error={errors.userPassword}
                />
              </div>

              {!isLocked && (
                <p className="text-xs text-[var(--color-primary-800)] mt-3">
                  Intentos disponibles: {3 - failedAttempts} de 3
                </p>
              )}

              {isLocked && (
                <p className="text-sm text-red-600 font-semibold mt-3">
                  Has agotado los 3 intentos. Recarga la página.
                </p>
              )}

              {/* Recuperar contraseña */}
              <div className="flex justify-end mt-5">
                <Link
                  to="/recover-password"
                  onClick={(e) => isLocked && e.preventDefault()}
                  className={`text-sm font-semibold text-[var(--color-primary-700)] hover:underline ${
                    isLocked ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón */}
              <div className="mt-7">
                <LoginButton disabled={isLocked}>
                  {isLocked
                    ? "Bloqueado"
                    : "Iniciar sesión"}
                </LoginButton>
              </div>

              {/* Registro */}
              <div className="text-center mt-6">
                <span className="text-sm text-[var(--color-primary-800)]">
                  ¿No tienes una cuenta?{" "}
                </span>

                <Link
                  to="/CreateUserLogin"
                  onClick={(e) => isLocked && e.preventDefault()}
                  className={`text-sm font-semibold text-[var(--color-primary-700)] hover:underline ${
                    isLocked ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  Regístrate
                </Link>
              </div>

            </fieldset>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-primary-800)] mt-6">
          Coffee Flavor © 2026 - Todos los derechos reservados
        </p>

        <Outlet />
      </div>
    </div>
  );
}
