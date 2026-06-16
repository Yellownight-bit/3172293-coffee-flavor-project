// UserRegisterForm2 componente para modificar el URF

import { useState, } from "react"
import { Input, Checkbox, Button} from "@/shared";
// import { getDocumentTypes } from "@/services/selectService";
// import { useNavigate } from "react-router-dom";
import { userSchema } from "../schemas/userSchema"

export default function UserRegisterForm (){

    // const navigate = useNavigate();

    //Estado
    

    //Estado del error
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        userDocumentTypes: "",
        userDocumentNumber: "",
        userPassword: "",
        userImage: [],

        //Flags booleanos
        isStaff: false,
        isActive: true,
        isSuperUser: false,
    });

    //Estado para los tipos de documento
    // const [documentTypes, setDocumentTypes] = useState([])

    //Uso del estado useEffect
    //  useEffect(() => {
    //     getDocumentTypes().then(setDocumentTypes);
    //   },[])

    //================================================
    //         handleGenerico
    //===============================================


    //Función que se ejecutra cada vez que cambia el valor de un input del formulario

    const handleChange = (e) => {
        // Se obtiene el nombre del campo y su valor
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            //Se copian todos los valores anteriores del estado
            ...prev,

            //Se actualiza unicamente lo que cambio
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    //============handle submit======================//

    const handleSubmit = async (e) => {
    //Evita que el formulario recargue la página
    e.preventDefault();

    //Validamos los datos del formulario contra el esquema Zod
    //safeParse No lanza excepción, retorna un objeto controlado
    const result = userSchema. safeParse(formData);

    //Verificar en consola si el esquema esta funcionando correctamente
    //console.log(result)

    //Si la validación falla
    if(!result.sucess) {
        //Objeto donde almacenaremos los errores por campo
        const fieldErrors = {};

        //Recorremos cada error generado por Zod
        result.error.issues.forEach((issue) => {
            //issue.path[0] corresponde al nombre del campo
            //issue.message contiene el mensaje de error definido en el schema
            fieldErrors[issue.path[0]] = issue.message;
        });

        //Actualiza,ps el estado de errores para mostrarlos en la UI
        setErrors(fieldErrors);

        //Cortamos la ejecución: NO se envia nada al backend

        return;
    }

    //Si la validación pasa, limpiamos errores previos
    setErrors({});
    
    //Activamos estado de envio (útil para deshabilitar el botón)
    // setIsSubmitting(true);

    try {
        //Lamamos al servicio fronted que consume la API
        //result.data contiene los datos ya validados por Zod
        // const response = await createUser(result.data);

        //Log informativo para desarrollo
        // console.log("Usuario creado:", response);

        //Feedback basico al usuario
        alert("Usuario creado correctamente");

        //Navegamos a la vista anterior
        //Navigate(-1) equivale a "volver atras"
        // navigate(-1);
    }   catch(error) {
        //Capturamos errores de red o errores lanzados por el service
        console.error("Error:", error.message);

        //Mostramos el mensaje de error al usuario
        alert(error.message);
    }   finally {
        //Pase lo que pase, desactivamos el estado de envio
        // setIsSubmitting(false);
    }
};

    //================================================
    //         Handle NameChange
    //===============================================

    // const handleNameChange = (e) => {
    //     const value = e.target.value.trim();

    //     if (value ==="") {
    //         console.log("El nombre no puede estar vació");
    //     }
    // };

    return(
        <div className="grid items-center justify-center bg-orange-100 border border-orange-500 rounded p-16">
            <h1 className="mx-auto my-2 text-title font-bold">Inicio de sesión</h1>
            <div className="flex justify-center">
            <img className = "flex w-16 h-16 align-center justify-center" src="/src/assets/icons/icon1.png" alt="Imagen" />
            </div>
            {/*formulario*/}
            <form 
            action=""
            onSubmit={handleSubmit}
            >

            <Input
            label="Correo"
            name="userEmail"
            type="email"
            value={formData.userEmail}
            placeholder="Escribe tu correo electronico"
            htmlFor= "user-email"
            onChange={handleChange}
            error={errors.userEmail}


            />
           
            <Input
            label="Contraseña"
            name="userPassword"
            type="password"
            value={formData.userPassword}
            placeholder="Escribe tu contraseña"
            htmlFor= "user-password"
            onChange={handleChange}
            error={errors.userPassword}
            />

            <div className="grid gap-0 my-auto">

                {/* checkbox */}
            <div className="flex items-center justify-between my-6">

            <Checkbox
                id="isSuperUser"
                name="isSuperUser"
                label="Recuerdame"
                checked={formData.isSuperUser}
                onChange={handleChange}
            />

            <button
                type="button"
                className="text-sm text-orange-500 hover:underline"
            >
                ¿Olvidaste tu contraseña?
            </button>

            </div>

            <button
                type="button"
                className="text-sm text-orange-500 hover:underline mb-4"
            >
                ¿No tienes cuenta?
            </button>

            {/* Botón secundario */}
            
            </div>
            
                {/*Actions*/}
                <div className="flex gap-6 items-center justify-center" >

                <Button
                    variant= "secondary"
                    size= "md"
                    type= "button"
                    onClick={() => console.log("Se oprimio el cancelar")}
                
                >Registrarse
                </Button>

                <Button
                    variant= "primary"
                    size= "md"
                    type= "sumbit"
                    onClick={() => console.log("Se oprimio el submit")}
                
                >Iniciar Sesión
                </Button>

                </div>
            </form>
        </div>
    )
}