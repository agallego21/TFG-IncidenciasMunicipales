const express = require('express')
const path = require('path');

const app = express()

//Conexión a la BD
const crearConexionBD = require('./config/conexionBD');
crearConexionBD();

//Model
const Usuario = require('./model/usuario.model.js')
const Ayuntamiento = require('./model/ayuntamiento.model.js')
const Incidencia = require('./model/incidencia.model.js')

// CORS config
const cors = require('cors')
let corsOptions = {
   origin : ['http://localhost:5173'],
}
app.use(cors(corsOptions))

app.use(express.json())

//Routing
app.get('/', (req, res) => res.send('<h1>SERVER STARTED</h1>'))

/*********Archivos que definen las rutas de cada elemento*** */
// Rutas Usuario
const rutasUsuarios = require('./routes/usuarios.routes');
app.use('/usuarios', rutasUsuarios);

// Rutas Ayuntamientos
const rutasAyuntamientos = require('./routes/ayuntamientos.routes');
app.use('/ayuntamientos', rutasAyuntamientos);

// Rutas Incidencia
const rutasIncidencias = require('./routes/incidencias.routes');
app.use('/incidencias', rutasIncidencias);

// Rutas imágenes
const rutasImagenes = require('./routes/imagenes.routes');
app.use('/imagenes', rutasImagenes);

//Rutas tiposUsuarios
const tiposUsuarioRoutes = require('./routes/tiposUsuario.routes');
app.use('/tiposUsuario', tiposUsuarioRoutes);

//Rutas tiposIncidencia
const tiposIncidenciaRoutes = require('./routes/tiposIncidencia.routes');
app.use('/tiposIncidencia', tiposIncidenciaRoutes);

//Rutas estadosIncidencia
const estadosIncidenciaRoutes = require('./routes/estadosIncidencia.routes');
app.use('/estadosIncidencia', estadosIncidenciaRoutes);

// Carpeta estática
app.use(express.static(path.join(__dirname, 'public')));

//Arranque del server
app.listen(5005, ()=>console.log('Server started'))


