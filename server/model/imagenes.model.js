const mongoose = require('mongoose')

const imagenenesSchema = mongoose.Schema({
  nombreArchivo: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  fechaSubida: {
    type: Date,
    default: Date.now
  }
});
const Imagen = mongoose.model('imagen', imagenesSchema)

module.exports = Imagen

