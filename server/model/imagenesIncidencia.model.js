const mongoose = require('mongoose')

const imagenesIncidenciaSchema = mongoose.Schema({
  idIncidencia: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la incidencia
    ref: 'Incidencia',
    required: true
  },
  idImagen: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al _id de la imagen
    ref: 'Imagen',
    required: true
  }
});

const ImagenIncidencia = mongoose.model('ImagenIncidencia', imagenesIncidenciaSchema, 'imagenesIncidencia')

module.exports = ImagenIncidencia