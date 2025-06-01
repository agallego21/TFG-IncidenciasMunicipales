const mongoose = require('mongoose')

const estadosIncidenciaSchema = mongoose.Schema({
  idEstado: {
    type: Number,
    required: true,
    unique: true
  },
  estadoIncidencia: {
    type: String,
    required: true,
    trim: true
  }
});
const EstadoIncidencia = mongoose.model('estadoIncidencia', estadosIncidenciaSchema)

module.exports = EstadoIncidencia