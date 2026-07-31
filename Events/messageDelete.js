/**
 * Evento: messageDelete
 * Registra mensagens apagadas no canal de logs.
 */

const config = require('../Config/config');
const { registrarLog } = require('../Utils/logger');

module.exports = {
  name: 'messageDelete',
  async execute(message, client) {
    try {
      // Ignora mensagens de bots
      if (message.author?.bot) return;

      const detalhes = `Mensagem apagada em <#${message.channelId}> por possivelmente moderadores.\n**Conteúdo:** ${message.content || '(sem texto/arquivo)'}`;

      await registrarLog(client, 'mensagem_apagada', message.author?.id || '', '', detalhes);
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} [messageDelete] Erro:`, erro.message);
    }
  },
};
