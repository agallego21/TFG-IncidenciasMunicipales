const mongoose = require('mongoose')

const tiposIncidenciaSchema = mongoose.Schema({
   idTipo: {
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
const TipoIncidencia = mongoose.model('tipoIncidencia', tiposIncidenciaSchema, 'tiposIncidencia')

module.exports = TipoIncidencia