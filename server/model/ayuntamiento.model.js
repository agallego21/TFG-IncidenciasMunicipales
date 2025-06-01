const mongoose = require('mongoose')

const ayuntamientoSchema = mongoose.Schema({
	idAyuntamiento: {
		type: Number,
		required: true,
		unique: true
	},
	municipio: {
		type: String,
		required: true,
		trim: true
	},
	idImagen: {
		type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la imagen
		ref: 'Imagen',
		required: true
	},
	centroLatitud: {
		type: String,
		required: true,
	},
	centroLongitud: {
		type: String,
		default: null,
		required: true,
	},
	zona: {
		type: String,
		default: null
	},
	direccionPostal: {
		type: String,
		default: null
	},
	correoElectronico: {
		type: String,
		lowercase: true,
		trim: true,
		default: null
	},
	telefono: {
		type: Number,
		default: null
	},
	fax: {
		type: Number,
		default: null
	},
	fechaAlta: {
		type: Date,
		default: Date.now
	},
	fechaModif: {
		type: Date,
		default: Date.now
	},
	estado: {
		type: Number,
		default: 1 // Valores 0-Inactivo, 1-activo
	}
});

ayuntamientoSchema.pre('save', function (next) {
	this.fechaModif = new Date();
	next();
});

const Ayuntamiento = mongoose.model('ayuntamiento', ayuntamientoSchema)

module.exports = Ayuntamiento