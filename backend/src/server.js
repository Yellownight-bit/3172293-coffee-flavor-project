
// Cargamos las variables de entorno antes de importar los demás módulos
import "dotenv/config";

// Importamos la instancia de la aplicación Express ya configurada.
// app.js debe encargarse de middlewares, rutas y configuración general.
import app from "./app.js";

// Importamos la función que verifica la conexión con Gmail
import { verifyMailer } from "./config/mailer.js";

// Definimos el puerto del servidor
// Se prioriza el valor definido en el entorno (producción)
// y se usa 4000 como valor por defecto en desarrollo
const PORT = process.env.PORT || 4000;

// Iniciamos el servidor HTTP usando la app de Express
// listen levanta el servidor y queda a la espera de peticiones
app.listen(PORT, async () => {

    // Log informativo indicando que el servidor está corriendo
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);

    // Verificamos que la conexión con Gmail funcione correctamente
    await verifyMailer();
});
