/**
 * Obtiene el siguiente valor de una secuencia desde la colección "secuencias".
 * Si la secuencia no existe, la crea automáticamente con valor inicial 1.
 */
const Secuencia = require('../model/secuencia.model');

const getSiguienteValorSecuencia = async (tipo) => {
  try {
    const resultado = await Secuencia.findOneAndUpdate(
      { tipoSecuencia: tipo },
      { $inc: { valor: 1 } },
      { new: true, upsert: true } // upsert por si no existe aún
    );

    return resultado.valor;
  } catch (error) {
    throw new Error('Error al obtener la siguiente secuencia: ' + error.message);
  }
};

module.exports = {
  getSiguienteValorSecuencia
};