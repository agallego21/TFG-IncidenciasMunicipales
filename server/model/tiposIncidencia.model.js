const mongoose = require('mongoose')

const tiposIncidenciaSchema = mongoose.Schema({
   idEstado: {
    type: Number,
    required: true,
    unique: true
  },
  tipoIncidencia: {
    type: String,
    required: true,
    trim: true
  }
});
const TipoIncidencia = mongoose.model('tipoIncidencia', tiposIncidenciaSchema)

module.exports = TipoIncidencia