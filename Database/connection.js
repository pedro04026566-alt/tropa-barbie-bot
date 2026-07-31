/**
 * Conexão com MongoDB usando Mongoose.
 * Gerencia conexão, reconexão automática e tratamento de erros.
 */

const mongoose = require('mongoose');
const config = require('../Config/config');

let conectado = false;

/**
 * Conecta ao banco de dados MongoDB.
 * Usa a URI definida no arquivo .env.
 */
async function conectarBanco() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tropa_barbie';

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    conectado = true;
    console.log(`${config.geral.prefixoLog} [DB] Conectado ao MongoDB com sucesso.`);

    // Reconexão automática
    mongoose.connection.on('disconnected', () => {
      console.warn(`${config.geral.prefixoLog} [DB] Desconectado do MongoDB. Tentando reconectar...`);
      conectado = false;
      setTimeout(conectarBanco, 5000);
    });

    mongoose.connection.on('error', (erro) => {
      console.error(`${config.geral.prefixoLog} [DB] Erro no MongoDB:`, erro.message);
    });
  } catch (erro) {
    console.error(`${config.geral.prefixoLog} [DB] Falha ao conectar no MongoDB:`, erro.message);
    console.error('Verifique se o MongoDB está rodando e a URI no .env está correta.');
    process.exit(1);
  }
}

/**
 * Verifica se o banco está conectado.
 * @returns {boolean}
 */
function isConnected() {
  return conectado && mongoose.connection.readyState === 1;
}

module.exports = { conectarBanco, isConnected };
