const Ayuntamiento = require('../model/ayuntamiento.model');
const Imagen = require('../model/imagenes.model');
const { getSiguienteValorSecuencia } = require('../utils/secuencias');

// Crear un nuevo ayuntamiento
exports.crearAyuntamiento = async (req, res) => {
  try {
    const nuevoId = await getSiguienteValorSecuencia('ayuntamientos');

    let imagenGuardada = null;
    if (req.file) {
      const nuevaImagen = new Imagen({
        nombreArchivo: req.file.filename,
        path: `/images/ayuntamientos/${req.file.filename}`,
        mimetype: req.file.mimetype,
      });

      imagenGuardada = await nuevaImagen.save();
    }

    const ayuntamientoData = {
      idAyuntamiento: nuevoId,
      municipio: req.body.municipio,
      direccionPostal: req.body.direccionPostal,
      correoElectronico:req.body.correoElectronico,
      telefono:req.body.telefono,
      fax:req.body.fax,
      coordenadasCentro: JSON.parse(req.body.coordenadasCentro),
      idImagen: imagenGuardada?._id || null,
      fechaAlta: new Date(),
      fechaModif: new Date()
    };

    const nuevoAyuntamiento = new Ayuntamiento(ayuntamientoData);

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
    const ayuntamientos = await Ayuntamiento.find().populate('idImagen') ;
    res.json(ayuntamientos);
  } catch (error) {
    console.error('Error al obtener ayuntamientos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los ayuntamientos' });
  }
};

// Obtener un ayuntamiento por su ID interno (idAyuntamiento)
exports.obtenerAyuntamientoPorId = async (req, res) => {
  try {
    const ayuntamiento = await Ayuntamiento.findOne({ idAyuntamiento: req.params.idAyuntamiento })
      .populate('idImagen') 
      .exec();

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
    let imagenGuardada = null;

    if (req.file) {
      const nuevaImagen = new Imagen({
        nombreArchivo: req.file.filename,
        path: `/images/ayuntamientos/${req.file.filename}`,
        mimetype: req.file.mimetype,
      });

      imagenGuardada = await nuevaImagen.save();
    }

console.log(req.body);

    const ayuntamientoData = {
      municipio: req.body.municipio,
      direccionPostal: req.body.direccionPostal,
      correoElectronico:req.body.correoElectronico,
      telefono:req.body.telefono,
      fax:req.body.fax,
      coordenadasCentro: JSON.parse(req.body.coordenadasCentro),
      fechaModif: new Date(),
    };

    // Asociar imagen si se ha subido
    if (imagenGuardada) {
      ayuntamientoData.idImagen = imagenGuardada._id;
    }

    const ayuntamientoActualizado = await Ayuntamiento.findOneAndUpdate(
      { idAyuntamiento: req.params.id },
      ayuntamientoData,
      { new: true }
    );


    if (!ayuntamientoActualizado) {
      return res.status(404).json({ error: "Ayuntamiento no encontrado" });
    }

    res.json(ayuntamientoActualizado);
  } catch (error) {
    console.error("Error al actualizar ayuntamiento:", error);
    res.status(500).json({ error: "No se pudo actualizar el ayuntamiento" });
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