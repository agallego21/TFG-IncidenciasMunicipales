const express = require('express')
const app = express()

//DB Connecton
const mongoose = require('mongoose')
mongoose
	//.connect('mongodb+srv://testing:Test_24!.@dbcluster0.2jre5ex.mongodb.net/testingDB')
	.connect('mongodb+srv://agallego:TFG_25!.@cluster0.jq9m4ia.mongodb.net/TFG_GestIncidencias_db')
	.then(() => console.log('DB Connected'))
	
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
const rutasUsuarios = require('./routes/usuario.routes');
app.use('/usuarios', rutasUsuarios);

// Rutas Incidencia
const rutasIncidencias = require('./routes/incidencias.routes');
app.use('/incidencias', rutasIncidencias);


//Arranque del server
app.listen(5005, ()=>console.log('Server started'))


