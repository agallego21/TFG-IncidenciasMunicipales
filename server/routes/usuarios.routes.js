const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuario.controller');

router.get('/', usuariosController.obtenerUsuarios);
router.get('/:idUsuario', usuariosController.obtenerUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
router.put('/:idUsuario', usuariosController.actualizarUsuario);
router.delete('/:idUsuario', usuariosController.eliminarUsuario);

router.post('/login', usuariosController.loginUsuario);

module.exports = router;