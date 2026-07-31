/**
 * Evento: guildMemberAdd
 * Sistema de boas-vindas personalizado — anuncia quando alguém entra no servidor.
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../Config/config');
const { registrarLog } = require('../Utils/logger');
const { Membro } = require('../Database');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    try {
      const canalId = config.canais.boasVindas;
      if (!canalId) return;

      const canal = await client.channels.fetch(canalId).catch(() => null);
      if (!canal) return;

      // Conta total de membros
      const totalMembros = member.guild.memberCount;

      // Cria embed de boas-vindas estilizada
      const embed = new EmbedBuilder()
        .setColor(config.cores.primaria)
        .setTimestamp()
        .setTitle('🌸  Novo Membro!')
        .setDescription(
          `Bem-vindo(a) à **${config.faccao.nome}**, <@${member.id}>!\n\n` +
          `✦ ━━━━━━━━━━━━━━━━━━━━━ ✦\n\n` +
          `▸ **Usuário:** ${member.user.tag}\n` +
          `▸ **ID:** \`${member.id}\`\n` +
          `▸ **Conta criada em:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:d>\n\n` +
          `✦ ━━━━━━━━━━━━━━━━━━━━━ ✦\n\n` +
          `📜 Leia as regras em <#${config.canais.regras}>\n` +
          `🎫 Abra um ticket se precisar de ajuda\n\n` +
          `Você é o membro **#${totalMembros}** da nossa família! 💕`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: `${config.faccao.nome} • Boas-vindas`,
          iconURL: config.faccao.logo || undefined,
        });

      await canal.send({ content: `<@${member.id}>`, embeds: [embed] });

      // Registra no banco de dados
      await Membro.findOneAndUpdate(
        { discordId: member.id },
        {
          discordId: member.id,
          tag: member.user.tag,
          status: 'ativo',
          entrouEm: new Date(),
        },
        { upsert: true, new: true },
      );

      // Registra log
      await registrarLog(client, 'membro_entrou', '', member.id, `${member.user.tag} entrou no servidor`);
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} [guildMemberAdd] Erro:`, erro.message);
    }
  },
};
