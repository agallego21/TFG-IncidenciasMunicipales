/**
 * Obtiene el siguiente valor de una secuencia desde la colección "secuencias".
 * Si la secuencia no existe, la crea automáticamente con valor inicial 1.
 */
const getSiguienteValorSecuencia = async (tipoSecuencia, db) => {
  if (!tipoSecuencia) throw new Error('Se debe especificar un tipo de secuencia');
  if (!db) throw new Error('Conexión a la base de datos no proporcionada');

  try {
    const resultado = await db.collection('secuencias').findOneAndUpdate(
      { tipoSecuencia },
      { $inc: { valor: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    return resultado.value.valor;
  } catch (error) {
    console.error(`Error al obtener secuencia para tipo "${tipoSecuencia}":`, error);
    throw new Error('No se pudo obtener el siguiente valor de la secuencia');
  }
};

module.exports = { getSiguienteValorSecuencia };