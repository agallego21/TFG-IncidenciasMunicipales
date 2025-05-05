const mongoose = require('mongoose')

const ayuntamientoSchema = mongoose.Schema({
	idAyuntamiento: Number,
	municipio: String,
	zona: String
})

const Ayuntamiento = mongoose.model('ayuntamiento', ayuntamientoSchema)

module.exports = Ayuntamiento