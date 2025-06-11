const mongoose = require('mongoose')

const incidenciaSchema = mongoose.Schema({
	idAyuntamiento: {
		type: String,
		required: true // Relacionado con ayuntamiento.idAyuntamiento
	},
	idUsuario: {
		type: String,
		required: true // Relacionado con usuario.idUsuario
	},
	titulo: {
		type: String,
		required: true,
		maxlength: 50,
		trim: true
	},
	descripcion: {
		type: String,
		maxlength: 250,
		trim: true
	},
	fechaRegistro: {
		type: Date,
		default: Date.now
	},
	coordenadas: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number], // [longitud, latitud]
			required: true
		}
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
		default: 1
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