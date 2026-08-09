import { useState } from "react";
import { Input, Checkbox, Button } from "@/shared";
import { loginSchema } from "../users/schemas/loginSchema";
import { Link, useNavigate } from "react-router-dom";

export default function UserRegisterForm() {

  // Permite navegar entre las diferentes rutas
  const navigate = useNavigate();

  // Estado de los errores
  const [errors, setErrors] = useState({});

  // Estado del formulario
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
    isSuperUser: false,
  });

  // ========================================================
  //                    HANDLE CHANGE
  // ========================================================

  // Se ejecuta cada vez que cambia un campo del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpia el error del campo mientras el usuario escribe
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ========================================================
  //                    HANDLE SUBMIT
  // ========================================================

  const handleSubmit = async (e) => {
    // Evita que el formulario recargue la página
    e.preventDefault();

    // Validamos únicamente los campos necesarios para iniciar sesión
    const result = loginSchema.safeParse({
      userEmail: formData.userEmail,
      userPassword: formData.userPassword,
    });

    // Si la validación falla
    if (!result.success) {

      // Objeto donde almacenaremos los errores
      const fieldErrors = {};

      // Recorremos los errores generados por Zod
      result.error.issues.forEach((issue) => {

        // issue.path[0] corresponde al nombre del campo
        // issue.message contiene el mensaje definido en el schema
        fieldErrors[issue.path[0]] = issue.message;
      });

      // Mostramos los errores en la interfaz
      setErrors(fieldErrors);

      // Detenemos el envío
      return;
    }

    // Si la validación pasa, limpiamos los errores
    setErrors({});

    try {

      /*
       * Aquí posteriormente puedes conectar el servicio
       * que haga el login contra tu API.
       *
       * Ejemplo:
       *
       * const response = await loginUser(result.data);
       */

      // Mensaje de inicio de sesión
      alert("Usuario iniciado correctamente");

      /*
       * Limpiamos los datos del formulario.
       *
       * La contraseña NO se guarda en localStorage
       * ni en sessionStorage.
       */
      setFormData({
        userEmail: "",
        userPassword: "",
        isSuperUser: false,
      });

      // Navegamos al listado de usuarios
      navigate("/dashboard/userList");

    } catch (error) {

      console.error("Error:", error.message);

      alert(error.message);
    }
  };

  // ========================================================
  //                       RETURN
  // ========================================================

  return (
    <div className="grid items-center justify-center bg-orange-100 border border-orange-500 rounded p-16">

      {/* Título */}
      <h1 className="mx-auto my-2 text-title font-bold">
        Inicio de sesión
      </h1>

      {/* Imagen */}
      <div className="flex justify-center">
        <img
          className="flex w-16 h-16 align-center justify-center"
          src="/src/assets/icons/icon1.png"
          alt="Imagen"
        />
      </div>

      {/* Formulario */}
      <form
        action=""
        onSubmit={handleSubmit}
      >

        {/* Correo */}
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

        {/* Contraseña */}
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

        <div className="grid gap-0 my-auto">

          {/* Checkbox */}
          <div className="flex items-center justify-between my-6">

            <Checkbox
              id="isSuperUser"
              name="isSuperUser"
              label="Recuerdame"
              checked={formData.isSuperUser}
              onChange={handleChange}
            />

            {/* Olvidaste contraseña */}
            <button
              type="button"
              className="text-sm text-orange-500 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>

          </div>

          {/* Crear cuenta */}
          <button
            type="button"
            className="text-sm text-orange-500 hover:underline mb-4"
          >
            ¿No tienes cuenta?
          </button>

        </div>

        {/* Actions */}
        <div className="flex gap-6 items-center justify-center">

          {/* Registrarse */}
          <Link to="/CreateUser">
            <Button
              variant="secondary"
              size="md"
              type="button"
            >
              Registrarse
            </Button>
          </Link>

          {/* Iniciar sesión */}
          <Button
            variant="primary"
            size="md"
            type="submit"
          >
            Iniciar Sesión
          </Button>

        </div>

      </form>
    </div>
  );
}