const mongoose = require('mongoose')

const tiposUsuarioSchema = mongoose.Schema({
   idTipo: {
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
const TipoUsuario = mongoose.model('tipoUsuario', tiposUsuarioSchema, "tiposUsuario")

module.exports = TipoUsuario