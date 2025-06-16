const express = require('express');
const router = express.Router();

const upload = require("../config/multer");

//Controlador de Ayuntamiento
const controlador = require('../controllers/ayuntamiento.controller');

router.post("/", upload.single("imagen"), controlador.crearAyuntamiento);
router.get('/', controlador.obtenerAyuntamientos);
router.get('/:idAyuntamiento', controlador.obtenerAyuntamientoPorId);
router.put("/:id", upload.single("imagen"), controlador.actualizarAyuntamiento);
router.delete('/:idAyuntamiento', controlador.eliminarAyuntamiento);


module.exports = router;