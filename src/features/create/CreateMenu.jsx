import { useState, useEffect } from "react";
import { Input, Select, Checkbox, Button } from "@/shared";
import { getDocumentTypes } from "@/services/selectService";
import { userSchema } from "../users/schemas/userSchema";

export default function UserRegisterForm() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userDocumentTypes: "",
    userDocumentNumber: "",
    userPassword: "",
    userImage: [],
    isStaff: false,
    isActive: true, 
    isSuperUser: false,
  });

  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    getDocumentTypes().then(setDocumentTypes);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageClick = () => {
    console.log("Simular apertura de explorador de archivos");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = userSchema.safeParse(formData);

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
      alert("Usuario creado correctamente");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Barra superior de color primary 900 que ocupa todo el ancho de la pantalla */}
      <div className="w-full h-16 bg-[var(--color-primary-900)] shadow-md" >
        <img class="flex w-27" alt="Imagen" src="/src/assets/icons/icon2.png"></img></div>
       

       {/* El texto de registro menu Junto el icono*/}
            <h2 className="text-[var(--color-black)] font-bold text-xl uppercase tracking-wider">registrar en El Menu<img src="public/icons8-menú.svg" alt="cargando"/></h2>

      {/* Contenedor inferior que toma todo el espacio restante y centra el formulario */}
      <div className="flex-1 p-4 flex items-center justify-center">
        
        <div className="w-full max-w-6xl bg-gradient-to-b from-[var(--color-gray-500)] to-[#9E9E9E] rounded-3xl p-8 shadow-md relative">
          
          <button 
            type="button"
            className="absolute top-6 left-6 bg-[var(--color-primary-950)] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-[var(--color-primary-900)] transition"
            onClick={() => console.log("Atrás")}
          >
            <span>←</span> Atrás
          </button>

          <div className="flex items-center gap-2 mt-8 mb-6 border-b border-[var(--color-primary-950)]/30 pb-3">
            <h2 className="text-[var(--color-primary-950)] font-bold text-xl uppercase tracking-wider"></h2>
          </div>
          


              <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-5">
                <div className="bg-white rounded-md w-80">

              </div>

                <div className="grid md:grid-cols-[30%_35%_35%] gap-4 items-center">

  {/* Columna 1 */}
     <div className="space-y-4 mr-8">
      <button 
        type="button"
        onClick={handleImageClick}
        className="h-[42px] w-full rounded-md border bg-white px-4 text-sm flex items-center justify-center gap-2 "
      >
        <span>↑</span> Subir imagen
        </button>
        
    </div>

  {/* Columna 2 */}
  <div className="space-y-4">
    <Input
         label="Nombre del platillo"
         name="userName"
         type="text"
         value={formData.userName}
         placeholder="Agregar nombre"
         htmlFor="user-name"
         onChange={handleChange}
         error={errors.userName}
    />

    <Select
         name="userDocumentTypes"
         value={formData.userDocumentTypes}
         htmlFor="FoodTypes"
         onChange={handleChange}
         options={documentTypes}
         error={errors.userDocumentTypes}
    />
  </div>

  {/* Columna 3 */}
  <div className="space-y-4">
    <Input
         label="Precio"
         name="userPhone"
         type="tel"
         value={formData.userPhone}
         placeholder="Agregar precio"
         htmlFor="user-phone"
         onChange={handleChange}
         error={errors.userPhone}
    />

    <Input
         label="Descripción"
         name="userAddress"
         type="text"
         placeholder="Agregar descripción"
         onChange={handleChange}
        />
     </div>

    </div>

            </div>

            <div className="pt-6 border-[var(--color-primary-950)]/20 flex flex-col sm:flex-row justify-between items-center gap-6">
              
              <div className="flex items-center gap-6 bg-[var(--color-primary-100)] p-3 rounded-xl px-5 border border-[var(--color-primary-200)]">
                <span className="font-bold text-gray-700 text-sm uppercase">Estado:</span>
                
                <div className="flex gap-4">
                  <Checkbox
                    id="isActive"
                    name="isActive"
                    label="Disponible"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <Checkbox
                    id="isStaff"
                    name="isStaff"
                    label="No disponible"
                    checked={formData.isStaff}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}