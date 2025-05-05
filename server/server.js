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

// CORS config
const cors = require('cors')
let corsOptions = {
   origin : ['http://localhost:5173'],
}
app.use(cors(corsOptions))


//Routing
app.get('/', (req, res) => res.send('<h1>SERVER STARTED</h1>'))

//Usuarios

app.get('/usuarios', (req, res) => {
	const {idAyuntamiento, email } = req.query;

	let filtro = {};
  
	if (idAyuntamiento) {
	  filtro.idAyuntamiento = idAyuntamiento;
	}

	if (email) {
		filtro.email = email;
	  }

	Usuario
		.find(filtro)
		.then(allUsers => res.json(allUsers))
})

app.get('/usuarios/:idUsuario', (req, res) => {
	const {idUsuario} = req.params
	Usuario
		.findOne({'idUsuario': idUsuario})
		.then(usuario => res.json(usuario))
})

//Ayuntamientos
app.get('/api/ayuntamientos', (req, res) => {
	Ayuntamiento
		.find()
		.then(allAyuntamientos => res.json(allAyuntamientos))
})

app.get('/api/ayuntamientos/:idAyuntamiento', (req, res) => {
	
	const {idAyuntamiento} = req.params
	Ayuntamiento
		.findById(idAyuntamiento)
		.then(ayuntamiento => res.json(ayuntamiento))
})

//Arranque del server
app.listen(5005, ()=>console.log('Server started'))


