/**
 * Evento: guildMemberRemove
 * Anuncia quando um membro sai do servidor e atualiza status no banco.
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../Config/config');
const { registrarLog } = require('../Utils/logger');
const { Membro } = require('../Database');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    try {
      const canalId = config.canais.boasVindas;
      if (!canalId) return;

      const canal = await client.channels.fetch(canalId).catch(() => null);
      if (!canal) return;

      const totalMembros = member.guild.memberCount;

      // Calcula tempo que ficou no servidor
      let tempoNoServer = '—';
      if (member.joinedTimestamp) {
        const dias = Math.floor((Date.now() - member.joinedTimestamp) / 86400000);
        if (dias > 0) {
          tempoNoServer = `${dias} dia(s)`;
        } else {
          const horas = Math.floor((Date.now() - member.joinedTimestamp) / 3600000);
          tempoNoServer = `${horas}h`;
        }
      }

      // Cria embed de saída estilizada
      const embed = new EmbedBuilder()
        .setColor(config.cores.erro)
        .setTimestamp()
        .setTitle('👋  Membro Saiu')
        .setDescription(
          `**${member.user.tag}** deixou o servidor.\n\n` +
          `✦ ━━━━━━━━━━━━━━━━━━━━━ ✦\n\n` +
          `▸ **Usuário:** ${member.user.tag}\n` +
          `▸ **ID:** \`${member.id}\`\n` +
          `▸ **Tempo no servidor:** ${tempoNoServer}\n` +
          `▸ **Membros restantes:** ${totalMembros}\n\n` +
          `✦ ━━━━━━━━━━━━━━━━━━━━━ ✦`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: `${config.faccao.nome} • Saída de Membro`,
          iconURL: config.faccao.logo || undefined,
        });

      await canal.send({ embeds: [embed] });

      // Atualiza status no banco
      await Membro.findOneAndUpdate(
        { discordId: member.id },
        { status: 'inativo' },
      );

      // Registra log
      await registrarLog(client, 'membro_saiu', '', member.id, `${member.user.tag} saiu do servidor (ficou ${tempoNoServer})`);
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} [guildMemberRemove] Erro:`, erro.message);
    }
  },
};
