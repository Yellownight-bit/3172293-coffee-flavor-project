import { useState, useEffect } from "react";
import { 
    Input,
    SelectInventory, 
    Checkbox, 
    Button } from "@/shared";
// import { getDocumentTypes } from "@/services/selectService";
import { getSupplierNames } from "@/services/selectService";
import { userSchema } from "../users/schemas/userSchema";


export default function CreateProductInventory() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    productName: "",
    productId: "",
    productQuantity: "",
    productSupplierNames: "",
    productSupplierNit: "",
    productDescription: "",
    userImage: [],
    isStaff: false,
    isActive: true,
  });

//   const [documentTypes, setDocumentTypes] = useState([]);

//   useEffect(() => {
//     getDocumentTypes().then(setDocumentTypes);
//   }, []);

  const [supplierNames, setSupplierNames] = useState([]);

  useEffect(() => {
    getSupplierNames().then(setSupplierNames);
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
        <div className="w-full h-16 bg-[var(--color-primary-900)] shadow-md"></div>

        {/* Contenedor inferior que toma todo el espacio restante y centra el formulario */}
        <div className="flex-1 p-4 flex items-center justify-center">
        
        {/* Background del contenedor inferior del formulario */}
        <div className="w-full max-w-6xl bg-gradient-to-b from-[var(--color-primary-800)] to-[#fcdfa6] rounded-3xl p-8 shadow-md relative">
          
            <button 
                type="button"
                className="absolute top-6 left-6 bg-[var(--color-primary-950)] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-[var(--color-primary-900)] transition"
                onClick={() => console.log("Atrás")}
            >
                <span>←</span> Atrás
            </button>
            
            <button 
                type="button"
                className="absolute top-6 left-240 bg-[var(--color-primary-950)] text-white px-4 py-2 rounded-lg text-md font-semibold flex items-center gap-1 hover:bg-[var(--color-primary-900)] transition"
                onClick={() => console.log("Viendo el inventario...")}
            >
                <span>👁️‍🗨️</span> Ver inventario
            </button>

            <button 
                type="button"
                className="absolute top-6 left-180 bg-[var(--color-primary-950)] text-white px-4 py-2 rounded-lg text-md font-semibold flex items-center gap-1 hover:bg-[var(--color-primary-900)] transition"
                onClick={() => console.log("Viendo el inventario...")}
            >
                <span>🔍</span> Actualizar inventario
            </button>

            <div className="flex items-center gap-2 mt-8 mb-6 border-b border-[var(--color-primary-950)]/30 pb-3">
                <div className="text-2xl text-[var(--color-text-inverse)]"
                    >
                        📋
                    <span className="font-bold text-xl relative -top-2 -left-1"
                    >
                        +
                    </span>
                </div>
                <h2 className=
                    "text-[var(--color-text-inverse)] font-bold text-xl uppercase tracking-wider"
                >
                    Registrar producto
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              
                <div className="space-y-4">
                    <Input
                        label="Nombre del producto"
                        name="product-name"
                        type="text"
                        value={formData.productName}
                        placeholder="Nombre del producto"
                        htmlFor="user-name"
                        onChange={handleChange}
                        error={errors.productName}
                    />

                    <Input
                        label="ID del producto"
                        name="product-id"
                        type="text"
                        value={formData.productId}
                        placeholder="ID del producto"
                        htmlFor="product-name"
                        onChange={handleChange}
                        error={errors.productId}
                    />

                    <Input
                        label="Nit del proveedor"
                        name="product-supplier-nit"
                        type="text"
                        value={formData.productSupplierNit}
                        placeholder="Nit del proveedor"
                        htmlFor="user-document-number"
                        onChange={handleChange}
                        error={errors.productSupplierNit}
                    />
                </div>

                <div className="space-y-5">
                    <div className="bg-[var(--color-primary-950)] rounded-md w-80">
                        <button
                            type="button"
                            onClick={handleImageClick}
                            className="h-[42px] relative w-full rounded-md border border-[var(--gray-800)] px-4 text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-primary-300)] transition"
                        >
                            <span>🔼</span> Subir imagen
                        </button>
                    </div>

                    <Input
                        label="Precio total"
                        name=""
                        type="text"
                        value={formData.productSupplierNit}
                        placeholder="Precio total"
                        onChange={handleChange}
                        error={errors.productSupplierNit}
                    />
                
                

                    <div className="relative">
                        <Input
                            label="Cantidad del producto"
                            name="productQuantity"
                            type="text"
                            value={formData.productQuantity}
                            placeholder="Cantidad del producto"
                            htmlFor="user-phone"
                            onChange={handleChange}
                            error={errors.productQuantity}
                        />

                        <button 
                            type="button" 
                            className="absolute right-0 -bottom-6 text-xs text-gray-700 flex items-center gap-1 hover:underline"
                        >
                        </button>
                    </div>
                </div>

                <div className="space-y-5">
                    <SelectInventory
                        label="Nombre del proveedor"
                        name="productSupplierNames"
                        value={formData.productSupplierNames}
                        htmlFor="productSupplierNames"
                        onChange={handleChange}
                        options={supplierNames}
                        error={errors.productSupplierNames}
                    />

                <div className="relative">
                    <Input
                        label="Descripcion del producto"
                        name="productDescription"
                        value={formData.productDescription}
                        type="text"
                        placeholder="Descripcion del producto"
                        onChange={handleChange}
                    />

                </div>

                    <Input
                        label="fecha ingreso"
                        name="productDescription"
                        type="password"
                        value={formData.productDescription}
                        placeholder="Escribe tu contraseña"
                        htmlFor="user-password"
                        onChange={handleChange}
                        error={errors.productDescription}
                    />
              </div>

            </div>

            <div className="pt-6 border-[var(--color-primary-950)]/20 flex flex-col sm:flex-row justify-between items-center gap-6">
              
                <div className="flex items-center gap-6 bg-[var(--color-primary-200)] p-3 rounded-xl px-5   border-2 border-[var(--color-primary-800)]">
                    <span className="font-bold text-gray-700 text-sm uppercase">Estado en el inventario:</span>
                
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
                            label="Agotado"
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
                        onClick={() => console.log("Se oprimio el cancelar")}
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
                        Registrar
                    </Button>
              </div>

            </div>
            </form>
        </div>
        </div>
    </div>
  );
}