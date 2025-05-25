const express = require('express');
const router = express.Router();
const Usuario = require('../model/usuario.model');
//Controlador lógica de Acceso a BD
//const usuariosController = require('../controllers/usuarios.controller');

/*router.get('/', usuariosController.obtenerUsuarios);
router.get('/:idUsuario', usuariosController.obtenerUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
router.put('/:idUsuario', usuariosController.actualizarUsuario);
router.delete('/:idUsuario', usuariosController.eliminarUsuario);*/

//Obtener todos los usuarios + filtro por ayuntamiento o username/email
router.get('/', (req, res) => {
	const {idAyuntamiento, email } = req.query;
	let filtro = {};
  
	if (idAyuntamiento) {
	  filtro.idAyuntamiento = idAyuntamiento;
	}
	if (email) {
		filtro.email = email;
	}

	Usuario
		.find(filtro)
		.then(allUsers => res.json(allUsers))
});

//Obtener usuario por su idUsuario
router.get('/:idUsuario', (req, res) => {
	const {idUsuario} = req.params
	Usuario
		.findOne({'idUsuario': idUsuario})
		.then(usuario => res.json(usuario))
});

module.exports = router;