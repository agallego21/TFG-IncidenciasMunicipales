const Usuario = require('../model/usuario.model');
const { getSiguienteValorSecuencia } = require('../utils/secuencias');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios, con filtros opcionales
const obtenerUsuarios = async (req, res) => {
  try {
    const { idAyuntamiento, email, tipoUsuario } = req.query;
    const filtro = {};

    if (idAyuntamiento) filtro.idAyuntamiento = Number(idAyuntamiento);
    if (email) filtro.email = email;
    if (tipoUsuario !== undefined) filtro.tipoUsuario = Number(tipoUsuario);

    const usuarios = await Usuario.find(filtro);
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por idUsuario
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const usuario = await Usuario.findOne({ idUsuario: Number(idUsuario) });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// Crear nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const datos = req.body;

    const nuevoId = await getSiguienteValorSecuencia('usuarios');

    const nuevoUsuario = new Usuario({
      ...datos,
      idUsuario: nuevoId
    });

    const guardado = await nuevoUsuario.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(400).json({ error: "Error al crear el usuario" });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const actualizado = await Usuario.findOneAndUpdate(
      { idUsuario: Number(idUsuario) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(actualizado);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(400).json({ error: "Error al actualizar el usuario" });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const eliminado = await Usuario.findOneAndDelete({ idUsuario: Number(idUsuario) });
    if (!eliminado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};


 const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Comprobar si el usuario está activo o pertenece al ayuntamiento

    // Devuelve los datos necesarios (sin la contraseña)
    const { password: _, ...usuarioSinPassword } = usuario.toObject();
    res.json({ usuario: usuarioSinPassword });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario
};
