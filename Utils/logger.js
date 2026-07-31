/**
 * Sistema de Logs — Registra ações no Discord e no MongoDB.
 */

const config = require('../Config/config');
const { Log } = require('../Database');
const { EmbedBuilder } = require('discord.js');

// Mapeamento de tipos de log para ícones
const icones = {
  membro_promovido: '⬆️',
  membro_rebaixado: '⬇️',
  membro_expulso: '👢',
  advertencia: '⚠️',
  ticket_criado: '🎫',
  ticket_fechado: '🔒',
  operacao_criada: '📋',
  economia_movimento: '💰',
  recrutamento_decisao: '📝',
  anuncio: '📢',
  membro_entrou: '👋',
  membro_saiu: '🚪',
  mensagem_apagada: '🗑️',
  cargo_alterado: '🎭',
  presenca: '🕐',
  bot_iniciado: '🤖',
};

/**
 * Registra um log no banco de dados e envia para o canal de logs do Discord.
 * @param {Client} client - Instância do client do Discord
 * @param {string} tipo - Tipo da ação (ex: 'membro_promovido')
 * @param {string} userId - ID de quem executou a ação
 * @param {string} alvoId - ID do alvo da ação (opcional)
 * @param {string} detalhes - Descrição da ação
 */
async function registrarLog(client, tipo, userId = '', alvoId = '', detalhes = '') {
  try {
    // Salva no MongoDB
    await Log.create({ tipo, userId, alvoId, detalhes });

    // Envia para o canal de logs no Discord
    const canalLogId = config.canais.logs;
    if (canalLogId && canalLogId !== 'ID_CANAL_LOGS') {
      const canal = await client.channels.fetch(canalLogId).catch(() => null);
      if (canal) {
        const icone = icones[tipo] || '📋';

        const embed = new EmbedBuilder()
          .setColor(config.cores.escura)
          .setTitle(`${icone} Log — ${tipo.replace(/_/g, ' ').toUpperCase()}`)
          .addFields(
            { name: '👤 Responsável', value: userId ? `<@${userId}>` : 'Sistema', inline: true },
            { name: '🎯 Alvo', value: alvoId ? `<@${alvoId}>` : '—', inline: true },
            { name: '📝 Detalhes', value: detalhes || '—', inline: false },
          )
          .setTimestamp()
          .setFooter({ text: `${config.faccao.nome} | Sistema de Logs` });

        await canal.send({ embeds: [embed] });
      }
    }
  } catch (erro) {
    console.error(`${config.geral.prefixoLog} [Logger] Erro ao registrar log:`, erro.message);
  }
}

module.exports = { registrarLog };
