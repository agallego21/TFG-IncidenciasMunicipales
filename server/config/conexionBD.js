const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://agallego:TFG_25!.@cluster0.jq9m4ia.mongodb.net/TFG_GestIncidencias_db';

const crearConexionBD = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Conexión a base de datos... OK');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

module.exports = crearConexionBD;