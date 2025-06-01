const mongoose = require('mongoose')

const incidenciaSchema = mongoose.Schema({
	idIncidencia: {
		type: String,
		required: true,
		unique: true
	},
	idUsuario: {
		type: String,
		required: true // Relacionado con usuario.idUsuario
	},
	titulo: {
		type: String,
		required: true,
		trim: true
	},
	descripcion: {
		type: String,
		trim: true
	},
	fechaRegistro: {
		type: Date,
		default: Date.now
	},
	puntoLongitud: {
		type: String,
		default: null
	},
	puntoLatitud: {
		type: String,
		default: null
	},
	direccion: {
		type: String,
		trim: true,
		default: null
	},
	tipoIncidencia: {
		type: Number,
		required: true
	},
	estado: {
		type: Number,
		default: 0
	},
	fechaResolucion: {
		type: Date,
		default: null
	},
	textoResolucion: {
		type: String,
		trim: true,
		default: null
	}
});

const Incidencia = mongoose.model('incidencia', incidenciaSchema)

module.exports = Incidencia