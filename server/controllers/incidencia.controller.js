const Incidencia = require("../model/incidencia.model");
const Imagen = require('../model/imagenes.model');
const ImagenIncidencia = require('../model/imagenesIncidencia.model');
const TipoIncidencia = require('../model/tiposIncidencia.model');

const crearIncidencia = async (req, res) => {
  try {
    const {
      idAyuntamiento,
      idUsuario,
      titulo,
      descripcion,
      direccion,
      tipoIncidencia,
      estado,
      fechaResolucion,
      textoResolucion
    } = req.body;

    const coordenadas = req.body.coordenadas ? JSON.parse(req.body.coordenadas) : null;

    const nuevaIncidencia = new Incidencia({
      idAyuntamiento,
      idUsuario,
      titulo,
      descripcion,
      coordenadas,
      direccion,
      tipoIncidencia,
      estado,
      fechaResolucion,
      textoResolucion
    });

    //Guardamos la incidencia
    const incidenciaGuardada = await nuevaIncidencia.save();

   // Si hay imagen subida, guardamos la  imagen en DB y creamos relación
    if (req.file) {
      const nuevaImagen = new Imagen({
        nombreArchivo: req.file.filename,
        path: `/images/incidencias/${req.file.filename}`,
        mimetype: req.file.mimetype,
      });

      const imagenGuardada = await nuevaImagen.save();

      //Creamos la relación incidencia-imagen
      const relacion = new ImagenIncidencia({
        idIncidencia: incidenciaGuardada._id,
        idImagen: imagenGuardada._id,
      });

      await relacion.save();
    }

    res.status(201).json(nuevaIncidencia);

  } catch (error) {
    console.error("Error al crear incidencia:", error);
    res.status(500).json({ message: "Error al crear incidencia" });
  }
};

const obtenerIncidencias = async (req, res) => {
  try {
    const incidencias = await Incidencia.find();
    const incidenciasConImagenes = await Promise.all(
      incidencias.map(async (incidencia) => {
        const relaciones = await ImagenIncidencia.find({ idIncidencia: incidencia._id });

        const imagenes = await Promise.all(
          relaciones.map(async (rel) => {
            const imagen = await Imagen.findById(rel.idImagen);
            return imagen ? {
              url: `${imagen.path}`,
              ...imagen.toObject()
            } : null;
          })
        );

        return {
          ...incidencia.toObject(),
          imagenes: imagenes.filter(Boolean)
        };
      })
    );

    res.json(incidenciasConImagenes);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener incidencias" });
  }
};

const obtenerIncidenciaPorId = async (req, res) => {
  try {
    const incidencia = await Incidencia.findOne({ _id: req.params.id });
    if (!incidencia) return res.status(404).json({ message: "No encontrada" });

    const incidenciasConImagenes = await Promise.all(
      incidencias.map(async (incidencia) => {
        const relaciones = await ImagenIncidencia.find({ idIncidencia: incidencia._id });

        const imagenes = await Promise.all(
          relaciones.map(async (rel) => {
            const imagen = await Imagen.findById(rel.idImagen);
            return imagen ? {
              url: `${imagen.path}`,
              ...imagen.toObject()
            } : null;
          })
        );
       return {
          ...incidencia.toObject(),
          imagenes: imagenes.filter(Boolean)
        };
      })
    );

    res.json(incidenciasConImagenes);
    
  } catch (error) {
    res.status(500).json({ message: "Error al obtener incidencia" });
  }
};

const obtenerIncidenciasPorAyuntamiento = async (req, res) => {
  try {
    const { idAyuntamiento } = req.params;
    const incidencias = await Incidencia.find({ idAyuntamiento });

    const incidenciasConImagenes = await Promise.all(
      incidencias.map(async (incidencia) => {
        const relaciones = await ImagenIncidencia.find({ idIncidencia: incidencia._id });

        const imagenes = await Promise.all(
          relaciones.map(async (rel) => {
            const imagen = await Imagen.findById(rel.idImagen);
            return imagen ? {
              url: `${imagen.path}`,
              ...imagen.toObject()
            } : null;
          })
        );
       return {
          ...incidencia.toObject(),
          imagenes: imagenes.filter(Boolean)
        };
      })
    );

    res.json(incidenciasConImagenes);
  } catch (error) {
    console.error("Error al obtener incidencias por ayuntamiento:", error);
    res.status(500).json({ message: "Error al obtener incidencias por ayuntamiento" });
  }
};

const obtenerIncidenciasPorUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const incidencias = await Incidencia.find({ idUsuario });

    const incidenciasConImagenes = await Promise.all(
      incidencias.map(async (incidencia) => {
        const relaciones = await ImagenIncidencia.find({ idIncidencia: incidencia._id });

        const imagenes = await Promise.all(
          relaciones.map(async (rel) => {
            const imagen = await Imagen.findById(rel.idImagen);
            return imagen ? {
              url: `${imagen.path}`,
              ...imagen.toObject()
            } : null;
          })
        );
       return {
          ...incidencia.toObject(),
          imagenes: imagenes.filter(Boolean)
        };
      })
    );

    res.json(incidenciasConImagenes);
  } catch (error) {
    console.error("Error al obtener incidencias por usuario:", error);
    res.status(500).json({ message: "Error al obtener incidencias por usuario" });
  }
};

const actualizarIncidencia = async (req, res) => {
  try {
    const actualizada = await Incidencia.findOneAndUpdate(
      { idIncidencia: req.params.id },
      req.body,
      { new: true }
    );
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar incidencia" });
  }
};

const eliminarIncidencia = async (req, res) => {
  try {
    await Incidencia.findOneAndDelete({ _id: req.params.id });
    res.json({ message: "Incidencia eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar incidencia" });
  }
};

module.exports = {
  crearIncidencia,
  obtenerIncidencias,
  obtenerIncidenciaPorId,
  obtenerIncidenciasPorAyuntamiento,
  obtenerIncidenciasPorUsuario,
  actualizarIncidencia,
  eliminarIncidencia
};