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
  const {
    nombre,
    apellidos,
    email,
    password,
    tipoUsuario,
    idAyuntamiento,
    imagen,
    estado
  } = req.body;

  try { //Validación de que no exista previamente
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'Ya existe el usuario dado de alta con esa dirección de email' });
    }

    //REcuperamos el valor del idUsuario
    const idUsuarioNuevo = await getSiguienteValorSecuencia('usuarios', db);

    // Creamos el nuevo usuario con todos los campos
    const nuevoUsuario = new Usuario({
      idUsuario: idUsuarioNuevo,
      nombre,
      apellidos,
      email,
      password,
      tipoUsuario,
      idAyuntamiento,
      imagen: imagen || null,
      estado: estado ?? 1 //ACtivo si no se especifica otro valor
    });

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