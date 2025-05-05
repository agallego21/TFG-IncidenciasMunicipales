const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema({
	idUsuario: Number,
	nombre: String,
	apellidos: String,
	email: String,
	password: String,
	tipoUsuario: Number, 
	idAyuntamiento: Number,
	avatar: String
})

const Usuario = mongoose.model('usuario', usuarioSchema)

module.exports = Usuario