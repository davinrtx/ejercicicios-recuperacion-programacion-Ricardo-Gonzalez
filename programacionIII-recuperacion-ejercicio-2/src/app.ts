import express from 'express'; 
import bodyParser from 'body-parser'; 
import path from 'path'; 
import cors from 'cors'; 
import routes from './routes/index'; // Importa las rutas definidas en el archivo index.ts

const app = express(); // Crea una instancia de la aplicación Express
const PORT = process.env.PORT || 3000; // Define el puerto del servidor

app.use(cors()); // Permite solicitudes desde otros dominios
app.use(bodyParser.urlencoded({ extended: true })); // Maneja datos de formularios codificados en URL
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos desde la carpeta 'public'

app.set('view engine', 'ejs'); // Configura EJS como motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Define la carpeta de vistas

app.use('/', routes); // Usa las rutas definidas en index.ts

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Indica que el servidor está en funcionamiento
});