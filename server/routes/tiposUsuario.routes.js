const express = require('express');
const router = express.Router();
const TipoUsuario = require('../model/tiposUsuario.model');

// GET /tiposUsuarios
router.get('/', async (req, res) => {
  try {
    const tipos = await TipoUsuario.find();
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los tipos de usuario' });
  }
});

module.exports = router;
