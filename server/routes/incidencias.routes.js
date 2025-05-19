const express = require('express');
const router = express.Router();
const Incidencia = require('../model/incidencia.model');

/***Usuarios***/
//Obtener todas las incidencias  + filtro por ayuntamiento o username/email
router.get('/', (req, res) => {
  const {idAyuntamiento, email } = req.query;
  let filtro = {};
  
  if (idAyuntamiento) {
    filtro.idAyuntamiento = idAyuntamiento;
  }
  if (email) {
    filtro.email = email;
  }

  Incidencia
    .find(filtro)
    .then(allIncidencias => res.json(allIncidencias))
});

//Obtener incidencia por su idIncidencia
router.get('/:idIncidencia', (req, res) => {
  const {idincidencia} = req.params
  Incidencia
    .findOne({'idincidencia': idincidencia})
    .then(incidencia => res.json(incidencia))
});


router.post('/', async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      coordenadas,
      direccion,
      tipoIncidencia,
      estado,
      fechaResolucion,
      textoResolucion
    } = req.body;

    const nuevaIncidencia = new Incidencia({
      titulo,
      descripcion,
      coordenadas,
      direccion,
      tipoIncidencia,
      estado,
      fechaResolucion,
      textoResolucion
    });

    const incidenciaGuardada = await nuevaIncidencia.save();

    res.status(201).json(incidenciaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error guardando la incidencia' });
  }
});

module.exports = router;