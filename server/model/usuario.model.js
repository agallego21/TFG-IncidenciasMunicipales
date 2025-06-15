const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

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
	required: false
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

// Middleware: actualiza fechaModif automáticamente y encripta la contraseña
usuarioSchema.pre('save', async function (next) {
  this.fechaModif = new Date();

  // Solo si la contraseña fue modificada o es nueva
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }

  next();
});

const Usuario = mongoose.model('usuario', usuarioSchema)

module.exports = Usuario