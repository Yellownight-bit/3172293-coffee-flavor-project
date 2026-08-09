import { useState, useEffect } from "react";
import { 
    Input,
    SelectInventory, 
    Checkbox, 
    Button,
    FileInput 
} from "@/shared";
import { getSupplierNames } from "@/services/selectService";
import { userSchema } from "../users/schemas/userSchema";
import Navbar from "@/shared/layouts/Navbar";
import { getCategorieTypes } from "@/services/selectCategorieTypes";
import { useNavigate } from "react-router-dom";
import backgroundImage from "@/assets/images/restaurant.jpg";

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

  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  const [supplierNames, setSupplierNames] = useState([]);

  useEffect(() => {
    getSupplierNames().then(setSupplierNames);
  }, []);

  const [CategorieTypes, setCategorieTypes] = useState([]);

  useEffect(() => {
    getCategorieTypes().then(setCategorieTypes);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    <div className="min-h-screen flex flex-col font-sans w-full max-w-full overflow-x-hidden bg-center bg-cover bg-no-repeat"
    style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Navbar */}
      <Navbar />

      {/* Contenedor inferior centrado */}
      <div className="flex-1 px-3 py-4 sm:px-6 sm:py-8 flex items-center justify-center w-full max-w-full box-border">
        
        {/* Card principal del formulario */}
        <div className="w-full max-w-6xl bg-gradient-to-b from-[var(--color-primary-800)] to-[#fcdfa6] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-md min-w-0 box-border overflow-hidden">
          
            {/* Encabezado fluido y adaptable */}
            <button 
                type="button"
                className="mb-3 self-start sm:self-auto bg-[var(--color-primary-950)] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-[var(--color-primary-900)] transition"
                onClick={() => navigate("/dashboard/productList")}
                >
            <span>←</span> Atrás
            </button>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-primary-950)]/30 pb-4 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🍝</span>
                    <h2 className="text-[var(--color-text-inverse)] font-bold text-lg sm:text-xl uppercase tracking-wider">
                        Agregar Platillo / Menu
                    </h2>
                </div>

                
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 w-full min-w-0">
            
                {/* Rejilla de campos adaptable (1 col en móvil, 2 en tablet, 3 en desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start w-full min-w-0">
              
                    {/* Columna 1 */}
                    <div className="space-y-4 w-full min-w-0">
                        <Input
                            label="Nombre del platillo"
                            name="productName"
                            type="text"
                            value={formData.productName}
                            placeholder="Ej. Torta de chocolate, pizza"
                            htmlFor="productName"
                            onChange={handleChange}
                            error={errors.productName}
                        />

                        <SelectInventory
                            label="Categorías"
                            name="productCategory"
                            value={formData.productCategory}
                            htmlFor="CategorieTypes"
                            onChange={handleChange}
                            options={CategorieTypes}
                            error={errors.productCategory}
                        />

                        <Input
                            label="Precio"
                            name="productPrice"
                            type="number"
                            value={formData.productPrice}
                            placeholder="0.00"
                            htmlFor="productPrice"
                            onChange={handleChange}
                            error={errors.productPrice}
                        />

                        <Input
                            label="Descripción"
                            name="productDescription"
                            type="text"
                            value={formData.productDescription}
                            placeholder="Describe las características de la comida"
                            htmlFor="productDescription"
                            onChange={handleChange}
                            error={errors.productDescription}
                        />
                    </div>
                
                    {/* Columna 2 */}
                    <div className="space-y-4 flex flex-col items-center w-full min-w-0">
                        <div className="w-full flex justify-center min-w-0">
                          <FileInput
                                value={files}
                                onChange={setFiles}
                                multiple={false}
                                accept="image/*"
                            />
                        </div>
                
                        <div className="w-full min-w-0">
                          <Input
                              label="Código de la comida"
                              name="productId"
                              type="text"
                              value={formData.productId}
                              placeholder="Ej. Comida-001"
                              htmlFor="productId"
                              onChange={handleChange}
                              error={errors.productId}
                          />
                        </div>

                        <div className="w-full min-w-0">
                            <SelectInventory
                                label="Proveedor"
                                name="productSupplierNames"
                                value={formData.productSupplierNames}
                                htmlFor="productSupplierNames"
                                onChange={handleChange}
                                options={supplierNames}
                                error={errors.productSupplierNames}
                            />
                        </div>
                    </div>

                    {/* Columna 3 */}
                    <div className="space-y-4 w-full min-w-0 md:col-span-2 lg:col-span-1">
                        <div className="w-full min-w-0">
                            <Input
                                label="Cantidad en Stock"
                                name="productQuantity"
                                value={formData.productQuantity}
                                type="number"
                                placeholder="0"
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            label="Fecha de envío"
                            name="shippingDate"
                            type="text"
                            value={formData.shippingDate}
                            placeholder="Ej. 20/04/2026"
                            htmlFor="shippingDate"
                            onChange={handleChange}
                            error={errors.shippingDate}
                        />
                    </div>

                </div>

                {/* Sección de Características */}
                <div className="pt-6 border-t border-[var(--color-primary-950)]/20 flex flex-col lg:flex-row justify-between items-start gap-6 w-full min-w-0">
              
                    <div className="space-y-3 w-full lg:w-auto min-w-0">
                        <span className="font-semibold text-gray-700 text-sm block">
                            Características (opcional)
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                            <Checkbox
                                id="nuevo"
                                name="nuevo"
                                label="Nueva comida"
                                checked={formData.nuevo}
                                onChange={handleChange}
                            />

                            <Checkbox
                                id="incluido"
                                name="incluido"
                                label="Bebida incluida"
                                checked={formData.garantia}
                                onChange={handleChange}
                            />

                            <Checkbox
                                id="agotable"
                                name="agotable"
                                label="Agotable"
                                checked={formData.agotable}
                                onChange={handleChange}
                            />

                            <Checkbox
                                id="oferta"
                                name="oferta"
                                label="En oferta"
                                checked={formData.oferta}
                                onChange={handleChange}
                            />

                            <Checkbox
                                id="envio"
                                name="envio"
                                label="Requiere envío a domicilio"
                                checked={formData.envio}
                                onChange={handleChange}
                            />

                            <Checkbox
                                id="activo"
                                name="activo"
                                label="Activo"
                                checked={formData.activo}
                                onChange={handleChange}
                            />

                            <Checkbox
                                id="destacado"
                                name="destacado"
                                label="Comida destacada"
                                checked={formData.destacado}
                                onChange={handleChange}
                            />

                            <Checkbox
                                id="importado"
                                name="importado"
                                label="Envío de comida a domicilio"
                                checked={formData.importado}
                                onChange={handleChange}
                            />

                            <Checkbox
                                id="devoluciones"
                                name="devoluciones"
                                label="Permitir Reembolsos"
                                checked={formData.devoluciones}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:self-end pt-2">
                        <Button
                            variant="secondary"
                            size="md"
                            type="button"
                            onClick={() => navigate("/dashboard/productList")}
                            className="px-6 py-2 rounded-full font-semibold border border-gray-400 text-gray-700 hover:bg-gray-100 transition w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                            className="px-8 py-2 rounded-full font-semibold bg-[var(--color-primary-950)] hover:bg-[var(--color-primary-900)] text-white shadow-md transition w-full sm:w-auto"
                        >
                            Guardar
                        </Button>
                    </div>

                </div>
            </form>
        </div>
      </div>
    </div>
  );
}