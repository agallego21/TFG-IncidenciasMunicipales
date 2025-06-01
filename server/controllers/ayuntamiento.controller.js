const Ayuntamiento = require('../models/Ayuntamiento');
const { getSiguienteValorSecuencia } = require('../utils/secuencias');
const db = require('../db'); // tu conexión a MongoDB

// Crear un nuevo ayuntamiento
exports.crearAyuntamiento = async (req, res) => {
  try {
    const nuevoId = await getSiguienteValorSecuencia('ayuntamientos', db);

    const nuevoAyuntamiento = new Ayuntamiento({
      idAyuntamiento: nuevoId,
      ...req.body,
      fechaAlta: new Date(),
      fechaModif: new Date()
    });

    await nuevoAyuntamiento.save();
    res.status(201).json(nuevoAyuntamiento);
  } catch (error) {
    console.error('Error al crear ayuntamiento:', error);
    res.status(500).json({ error: 'No se pudo crear el ayuntamiento', detalle: error.message });
  }
};

// Obtener todos los ayuntamientos
exports.obtenerAyuntamientos = async (req, res) => {
  try {
    const ayuntamientos = await Ayuntamiento.find();
    res.json(ayuntamientos);
  } catch (error) {
    console.error('Error al obtener ayuntamientos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los ayuntamientos' });
  }
};

// Obtener un ayuntamiento por su ID interno (idAyuntamiento)
exports.obtenerAyuntamientoPorId = async (req, res) => {
  try {
    const ayuntamiento = await Ayuntamiento.findOne({ idAyuntamiento: req.params.id });

    if (!ayuntamiento) {
      return res.status(404).json({ error: 'Ayuntamiento no encontrado' });
    }

    res.json(ayuntamiento);
  } catch (error) {
    console.error('Error al obtener ayuntamiento:', error);
    res.status(500).json({ error: 'Error al buscar el ayuntamiento' });
  }
};

// Actualizar un ayuntamiento por idAyuntamiento
exports.actualizarAyuntamiento = async (req, res) => {
  try {
    const ayuntamientoActualizado = await Ayuntamiento.findOneAndUpdate(
      { idAyuntamiento: req.params.id },
      { ...req.body, fechaModif: new Date() },
      { new: true }
    );

    if (!ayuntamientoActualizado) {
      return res.status(404).json({ error: 'Ayuntamiento no encontrado' });
    }

    res.json(ayuntamientoActualizado);
  } catch (error) {
    console.error('Error al actualizar ayuntamiento:', error);
    res.status(500).json({ error: 'No se pudo actualizar el ayuntamiento' });
  }
};

// Eliminar un ayuntamiento (inactivo)
exports.eliminarAyuntamiento = async (req, res) => {
  try {
    const ayuntamiento = await Ayuntamiento.findOneAndUpdate(
      { idAyuntamiento: req.params.id },
      { estado: 0, fechaModif: new Date() },
      { new: true }
    );

    if (!ayuntamiento) {
      return res.status(404).json({ error: 'Ayuntamiento no encontrado' });
    }

    res.json({ mensaje: 'Ayuntamiento desactivado correctamente', ayuntamiento });
  } catch (error) {
    console.error('Error al eliminar ayuntamiento:', error);
    res.status(500).json({ error: 'No se pudo eliminar el ayuntamiento' });
  }
};