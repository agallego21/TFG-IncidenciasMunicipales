const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tipo = req.body.tipo || 'otros'; // 'usuarios', 'ayuntamientos', 'incidencias', etc.
    const carpetaDestino = path.join(__dirname, `../public/images/${tipo}`);

    // Crear carpeta si no existe
    fs.mkdirSync(carpetaDestino, { recursive: true });
    cb(null, carpetaDestino);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nombreArchivo = file.fieldname + '-' + Date.now() + ext;
    cb(null, nombreArchivo);
  }
});

const upload = multer({ storage });

module.exports = upload;