const mongoose = require('mongoose')

const tiposUsuarioSchema = mongoose.Schema({
   idEstado: {
    type: Number,
    required: true,
    unique: true
  },
  tipoUsuario: {
    type: String,
    required: true,
    trim: true
  }
});
const TipoUsuario = mongoose.model('tipoUsuario', tiposUsuarioSchema)

module.exports = TipoUsuario