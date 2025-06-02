const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

// Ruta para subir una imagen
router.post('/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
  }

  const tipo = req.body.tipo || 'otros';

  const rutaImagen = `/images/${tipo}/${req.file.filename}`;

  //TODO-Guardar la imagen en la BD
  res.status(201).json({
    mensaje: 'Imagen subida correctamente',
    ruta: rutaImagen
  });
});

module.exports = router;