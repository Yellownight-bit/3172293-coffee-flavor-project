import { useState, useEffect } from "react";
import { Input, Select, Checkbox, Button, FileInput, CheckboxGroup } from "@/shared";
import { getSupplierDocumentTypes } from "@/services/selectSupplierService";
import { getSupplierProducts } from "@/services/selectProductService"
import { userSchema } from "../users/schemas/userSchema";
import Navbar from "@/shared/layouts/Navbar";
import { useNavigate } from "react-router-dom";

export default function UserRegisterForm() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userDocumentTypes: "",
    userDocumentNumber: "",
    userPassword: "",
    suppliedProducts: [],
    userImage: [],
    isStaff: false,
    isActive: true, 
    isSuperUser: false,
  });

  const navigate = useNavigate();

  const [documentTypes, setDocumentTypes] = useState([]);

  const [products, setProducts] = useState([]);

    useEffect(() => {
        getSupplierProducts().then(setProducts);
    }, []);

  useEffect(() => {
    getSupplierDocumentTypes().then(setDocumentTypes);
  }, []);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "suppliedProducts") {
    setFormData((prev) => ({
      ...prev,
      suppliedProducts: checked
        ? [...prev.suppliedProducts, value]
        : prev.suppliedProducts.filter((item) => item !== value),
    }));
    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  // const handleImageClick = () => {
  //   console.log("Simular apertura de explorador de archivos");
  // };

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
      {/* Navbar */}
      <Navbar />

      {/* Contenedor inferior que toma todo el espacio restante y centra el formulario */}
      <div className="flex-1 p-4 flex items-center justify-center">
        
        <div className="w-full max-w-6xl bg-gradient-to-b from-[var(--color-primary-800)] to-[#fcdfa6] rounded-3xl p-8 shadow-md relative">
          
          <button 
            type="button"
            className="absolute top-6 left-6 bg-[var(--color-primary-950)] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-[var(--color-primary-900)] transition"
            onClick={() => navigate("/dashboard/supplierList")}
          >
            <span>←</span> Atrás
          </button>

          <div className="flex items-center gap-2 mt-8 mb-6 border-b border-[var(--color-primary-950)]/30 pb-3">
            <div className="text-2xl text-[var(--color-primary-950)]">👤<span className="font-bold text-xl relative -top-2 -left-1">+</span></div>
            <h2 className="text-[var(--color-primary-950)] font-bold text-xl uppercase tracking-wider">Registrar Proveedor</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              
              <div className="space-y-4">
                <Input
                  label="Nombre de la Empresa"
                  name="userName"
                  type="text"
                  value={formData.userName}
                  placeholder="Empresa"
                  htmlFor="user-name"
                  onChange={handleChange}
                  error={errors.userName}
                />

                <Select   
                  label="Tipo de documento"
                  name="userDocumentTypes"
                  value={formData.userDocumentTypes}
                  htmlFor="userDocumentTypes"
                  onChange={handleChange}
                  options={documentTypes}
                  error={errors.userDocumentTypes}
                />

                <Input
                  label="Número de documento"
                  name="userDocumentNumber"
                  type="text"
                  value={formData.userDocumentNumber}
                  placeholder="Número de documento"
                  htmlFor="user-document-number"
                  onChange={handleChange}
                  error={errors.userDocumentNumber}
                />
              </div>

              <div className="space-y-5 flex flex-col items-center">
                <div className="w-full flex justify-center">
                  <FileInput/>
                </div>

                <Input
                  label="Dirección"
                  name="userAddress"
                  type="text"
                  placeholder="Dirección"
                  onChange={handleChange}
                />

                <div className="relative">
                  <Input
                    label="Número de contacto"
                    name="userPhone"
                    type="tel"
                    value={formData.userPhone}
                    placeholder="Número de contacto"
                    htmlFor="user-phone"
                    onChange={handleChange}
                    error={errors.userPhone}
                  />
                  <button 
                    type="button" 
                    className="absolute right-0 -bottom-6 text-xs text-gray-700 flex items-center gap-1 hover:underline"
                  >
                    <span>+</span> Agregar teléfono
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <Input
                  label="Correo electrónico Empresa"
                  name="userEmail"
                  type="email"
                  value={formData.userEmail}
                  placeholder="Correo electrónico Empresa"
                  htmlFor="user-email"
                  onChange={handleChange}
                  error={errors.userEmail}
                />

                <div className="relative">
                  <Input
                    label="Confirmar correo electrónico"
                    name="confirmEmail"
                    type="email"
                    placeholder="Confirmar correo electrónico"
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="absolute right-0 -bottom-6 text-xs text-gray-700 flex items-center gap-1 hover:underline"
                  >
                    <span>+</span>
                    Agregar correo
                  </button>
                </div>

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
              </div>

              <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observaciones
                  </label>

                  <textarea
                    name="observations"
                    rows={4}
                    value={formData.observations}
                    onChange={handleChange}
                    placeholder="Escriba observaciones del proveedor..."
                    className="w-full rounded-xl border border-gray-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-700)]"
                  />

              </div>
                <div className="flex justify-center">

                <CheckboxGroup
                    label="Productos que suministra"
                    className=""
                    name="suppliedProducts"
                    options={products}
                    value={formData.suppliedProducts}
                    onChange={handleChange}
                />
                </div>

            </div>

            <div className="pt-6 border-[var(--color-primary-950)]/20 flex flex-col sm:flex-row justify-between items-center gap-6">
              
              <div className="flex items-center gap-6 bg-[var(--color-primary-100)] p-3 rounded-xl px-5 border border-[var(--color-primary-200)]">
                <span className="font-bold text-gray-700 text-sm uppercase">Estado:</span>
                
                <div className="flex gap-4">
                  <Checkbox
                    id="isActive"
                    name="isActive"
                    label="Activo"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <Checkbox
                    id="isStaff"
                    name="isStaff"
                    label="Inactivo"
                    checked={formData.isStaff}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex gap-4 self-end">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => navigate("/dashboard/supplierList")}
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
                  Finalizar
                </Button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}