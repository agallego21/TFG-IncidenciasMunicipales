const express = require('express');
const router = express.Router();
const Ayuntamiento = require('../model/ayuntamiento.model');
//Controlador lógica de Acceso a BD
//const usuariosController = require('../controllers/usuarios.controller');

/*router.get('/', usuariosController.obtenerUsuarios);
router.get('/:idUsuario', usuariosController.obtenerUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
router.put('/:idUsuario', usuariosController.actualizarUsuario);
router.delete('/:idUsuario', usuariosController.eliminarUsuario);*/

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

module.exports = router;

/** PROBAR ESTO
const express = require('express');
const router = express.Router();
const controlador = require('../controllers/ayuntamientoController');

router.post('/', controlador.crearAyuntamiento);
router.get('/', controlador.obtenerAyuntamientos);
router.get('/:id', controlador.obtenerAyuntamientoPorId);
router.put('/:id', controlador.actualizarAyuntamiento);
router.delete('/:id', controlador.eliminarAyuntamiento);

module.exports = router;**/