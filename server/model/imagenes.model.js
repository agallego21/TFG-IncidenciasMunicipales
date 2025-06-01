const mongoose = require('mongoose')

const imagenenesSchema = mongoose.Schema({
  path: {
    type: String,
    required: true
  }
});
const Imagen = mongoose.model('imagen', imagenesSchema)

module.exports = Imagen