const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema({
  idUsuario: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
	unique: true
  },
  password: {
    type: String,
    required: true
  },
  tipoUsuario: {
    type: Number,
    required: true
  },
  idAyuntamiento: {
    type: Number,
    required: true
  },
  idImagen: {
	type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la imagen
	ref: 'Imagen',
	required: true
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

// Middleware: actualiza fechaModif automáticamente
usuarioSchema.pre('save', function (next) {
  this.fechaModif = new Date();
  next();
});

const Usuario = mongoose.model('usuario', usuarioSchema)

module.exports = Usuario