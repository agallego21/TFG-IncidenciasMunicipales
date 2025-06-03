const express = require('express');
const router = express.Router();
const TipoIncidencia = require('../model/tiposIncidencia.model');

// GET /tiposIncidencia
router.get('/', async (req, res) => {
  try {
    const tipos = await TipoIncidencia.find();
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los tipos de incidencia' });
  }
});

module.exports = router;
