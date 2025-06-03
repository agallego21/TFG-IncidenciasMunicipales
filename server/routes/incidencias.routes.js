const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const path = require("path");

const {
  crearIncidencia,
  obtenerIncidencias,
  obtenerIncidenciaPorId,
  obtenerIncidenciasPorAyuntamiento,
  obtenerIncidenciasPorUsuario,
  actualizarIncidencia,
  eliminarIncidencia
} = require("../controllers/incidencia.controller");

// Rutas (orden importa)
router.get("/ayuntamiento/:idAyuntamiento", obtenerIncidenciasPorAyuntamiento);
router.get("/usuario/:idUsuario", obtenerIncidenciasPorUsuario);
router.get("/", obtenerIncidencias);
router.get("/:id", obtenerIncidenciaPorId);
router.post("/", upload.single("imagen"), crearIncidencia);
router.put("/:id", actualizarIncidencia);
router.delete("/:id", eliminarIncidencia);

module.exports = router;



/**const express = require('express');
const router = express.Router();
const Incidencia = require('../model/incidencia.model');

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

module.exports = router;**/