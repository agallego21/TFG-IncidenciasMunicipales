const mongoose = require('mongoose');

const secuenciaSchema = mongoose.Schema({
  tipoSecuencia: {
    type: String,
    required: true,
    unique: true
  },
  valor: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('Secuencia', secuenciaSchema);