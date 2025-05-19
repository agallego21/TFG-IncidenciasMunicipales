const mongoose = require('mongoose')

const incidenciaSchema = mongoose.Schema({
	idAyuntamiento: Number,
	idIncidencia: Number,
	idUsuarioRegistro: Number,
	fechaRegistro: { type: Date, default: Date.now },
	titulo: { type: String, required: true },
 	descripcion: { type: String, required: true },
	coordenadas: {
   		lat: { type: Number, required: true },
		lng: { type: Number, required: true }
	},
	direccion: { type: String },
	tipoIncidencia: { type: Number },
	estado: { type: Number},
	fechaResolucion: { type: Date },
	textoResolucion: { type: String }
})

const Incidencia = mongoose.model('incidencia', incidenciaSchema)

module.exports = Incidencia