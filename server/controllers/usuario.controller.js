const Usuario = require('../models/Usuario');

exports.obtenerUsuarios = async (req, res) => {
  const { email, departamento } = req.query;
  const filtro = {};
  if (email) filtro.email = email;
  if (departamento) filtro.departamento = departamento;

  try {
    const usuarios = await Usuario.find(filtro);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar usuarios' });
  }
};

exports.obtenerUsuarioPorId = async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario, 10);

  try {
    const usuario = await Usuario.findOne({ idUsuario });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar el usuario' });
  }
};

exports.crearUsuario = async (req, res) => {
  const { idUsuario, nombre, apellidos, email, departamento } = req.body;

  try {
    const existe = await Usuario.findOne({ idUsuario });
    if (existe) return res.status(400).json({ error: 'idUsuario ya existe' });

    const nuevoUsuario = new Usuario({ idUsuario, nombre, apellidos, email, departamento });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario, 10);
  const cambios = req.body;

  try {
    const actualizado = await Usuario.findOneAndUpdate({ idUsuario }, cambios, { new: true });
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario, 10);

  try {
    const eliminado = await Usuario.findOneAndDelete({ idUsuario });
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};