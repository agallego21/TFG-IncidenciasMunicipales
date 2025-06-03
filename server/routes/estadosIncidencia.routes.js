const express = require('express');
const router = express.Router();
const EstadoIncidencia = require('../model/estadosIncidencia.model');

// GET /estadosIncidencia
router.get('/', async (req, res) => {
  try {
    const estados = await EstadoIncidencia.find();
    res.json(estados);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los estados de incidencia' });
  }
});

module.exports = router;
