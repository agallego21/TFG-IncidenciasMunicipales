const express = require('express');
const router = express.Router();

//Controlador de Ayuntamiento
const controlador = require('../controllers/ayuntamiento.controller');

router.post('/', controlador.crearAyuntamiento);
router.get('/', controlador.obtenerAyuntamientos);
router.get('/:idAyuntamiento', controlador.obtenerAyuntamientoPorId);
router.put('/:idAyuntamiento', controlador.actualizarAyuntamiento);
router.delete('/:idAyuntamiento', controlador.eliminarAyuntamiento);

module.exports = router;


/*const express = require('express');
const router = express.Router();
const Ayuntamiento = require('../model/ayuntamiento.model');

//Obtener todos los ayuntamientos
router.get('/', (req, res) => {
	Ayuntamiento
		.find()
		.then(allAyuntamientos => res.json(allAyuntamientos))
})

//Obtener ayuntamiento por su idAyuntamiento
router.get('/:idAyuntamiento', (req, res) => {
	const {idAyuntamiento} = req.params
	Ayuntamiento
		.findOne({'idAyuntamiento': idAyuntamiento})
		.then(ayuntamiento => res.json(ayuntamiento))
})

module.exports = router;*/