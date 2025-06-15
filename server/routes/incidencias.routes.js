const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const path = require("path");
const incidenciasController = require('../controllers/incidencia.controller');

// Rutas (el orden importa)
router.get("/ayuntamiento/:idAyuntamiento", incidenciasController.obtenerIncidenciasPorAyuntamiento);
router.get("/usuario/:idUsuario", incidenciasController.obtenerIncidenciasPorUsuario);
router.get("/", incidenciasController.obtenerIncidencias);
router.get("/:id", incidenciasController.obtenerIncidenciaPorId);
router.post("/", upload.single("imagen"), incidenciasController.crearIncidencia);
router.put("/:id", incidenciasController.actualizarIncidencia);
router.delete("/:id", incidenciasController.eliminarIncidencia);

module.exports = router;
