const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

console.log(req.body.tipo);

    const tipo = req.body.tipo || 'otros'; // 'usuarios', 'ayuntamientos', 'incidencias'
    const carpetaDestino = path.join(__dirname, `../public/images/${tipo}`);

    // Crear carpeta si no existe
    console.log("Carpeta destino:", carpetaDestino);
    fs.mkdirSync(carpetaDestino, { recursive: true });
    cb(null, carpetaDestino);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nombreArchivo = 'imagen-' + Date.now() + ext;
    cb(null, nombreArchivo);
  }
});

const upload = multer({ storage });

module.exports = upload;