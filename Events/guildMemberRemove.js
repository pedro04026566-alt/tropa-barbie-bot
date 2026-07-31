/**
 * Evento: guildMemberRemove
 * Registra saída de membros e atualiza status no banco.
 */

const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');
const { Membro } = require('../Database');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    try {
      // Atualiza status no banco se o membro existir
      await Membro.findOneAndUpdate(
        { discordId: member.id },
        { status: 'inativo' },
      );

      // Loga a saída
      await registrarLog(client, 'membro_saiu', '', member.id, `${member.user.tag} saiu do servidor`);
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} [guildMemberRemove] Erro:`, erro.message);
    }
  },
};
