const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	id: Number,
	nombre: String,
	apellidos: String,
	email: String,
	password: String,
	tipo: Number, 
	ayuntamientoID: String
})

const User = mongoose.model('user', userSchema)

module.exports = User