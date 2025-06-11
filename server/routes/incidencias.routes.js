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
