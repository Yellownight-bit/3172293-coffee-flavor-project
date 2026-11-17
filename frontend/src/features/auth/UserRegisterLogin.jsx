
import { useState } from "react";
import { Input, Checkbox, Button } from "@/shared";
import { loginSchema } from "../users/schemas/loginSchema";
import { login } from "@/features/auth/services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function UserRegisterForm() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);

  const isLocked = failedAttempts >= 3;

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
    isSuperUser: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) return;

    const result = loginSchema.safeParse({
      userEmail: formData.userEmail,
      userPassword: formData.userPassword,
    });

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

      sessionStorage.setItem("token", data.token);

      setFormData({
        userEmail: "",
        userPassword: "",
        isSuperUser: false,
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
          userEmail: `${error.message || "Correo o contraseña incorrectos"}. Intentos restantes: ${3 - nextAttempt}.`,
        });
      }
    }
  };

  return (
    <div className="grid items-center justify-center bg-brand-subtle border border-brand rounded p-16">
      <h1 className="mx-auto my-2 text-title font-bold">
        Inicio de sesión
      </h1>

      <div className="flex justify-center">
        <img
          className="flex w-16 h-16 align-center justify-center"
          src="/src/assets/icons/icon1.png"
          alt="Imagen"
        />
      </div>

      <form action="" onSubmit={handleSubmit}>
        <fieldset
          disabled={isLocked}
          className="border-0 p-0 m-0 min-w-0"
        >
          <Input
            label="Correo"
            name="userEmail"
            type="email"
            value={formData.userEmail}
            placeholder="Escribe tu correo electronico"
            htmlFor="user-email"
            onChange={handleChange}
            error={errors.userEmail}
          />

          <Input
            label="Contraseña"
            name="userPassword"
            type="password"
            value={formData.userPassword}
            placeholder="Escribe tu contraseña"
            htmlFor="user-password"
            onChange={handleChange}
            error={errors.userPassword}
          />

          {!isLocked && (
            <p className="text-sm text-text-secondary mt-2">
              Intentos disponibles: {3 - failedAttempts} de 3
            </p>
          )}

          {isLocked && (
            <p className="text-sm text-red-600 font-semibold mt-3">
              Has agotado los 3 intentos. Recarga la página.
            </p>
          )}

          <div className="grid gap-0 my-auto">
            <div className="flex items-center justify-between my-6">
              <Checkbox
                id="isSuperUser"
                name="isSuperUser"
                label="Recuerdame"
                checked={formData.isSuperUser}
                onChange={handleChange}
              />

              <Link
                to="/recover-password"
                onClick={(e) => isLocked && e.preventDefault()}
                className={isLocked ? "pointer-events-none opacity-50" : ""}
              >
                <button
                  type="button"
                  className="text-sm text-brand-strong hover:underline"
                  tabIndex={isLocked ? -1 : 0}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </Link>
            </div>

            <Link
              to="/CreateUserLogin"
              onClick={(e) => isLocked && e.preventDefault()}
              className={isLocked ? "pointer-events-none opacity-50" : ""}
            >
              <button
                type="button"
                className="text-sm text-brand-strong hover:underline mb-4"
                tabIndex={isLocked ? -1 : 0}
              >
                ¿No tienes cuenta?
              </button>
            </Link>
          </div>

          <div className="flex gap-6 items-center justify-center">
            <Link
              to="/CreateUserLogin"
              onClick={(e) => isLocked && e.preventDefault()}
              className={isLocked ? "pointer-events-none opacity-50" : ""}
            >
              <Button
                variant="secondary"
                size="md"
                type="button"
              >
                Registrarse
              </Button>
            </Link>

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isLocked}
            >
              {isLocked ? "Bloqueado" : "Iniciar Sesión"}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
