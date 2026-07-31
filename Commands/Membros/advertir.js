/**
 * Comando: /advertir
 * Registra uma advertência para um membro.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso, criarEmbedAviso, criarEmbedErro } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');
const { Membro } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advertir')
    .setDescription('Registra uma advertência para um membro')
    .addUserOption((opt) => opt.setName('membro').setDescription('Membro a ser advertido').setRequired(true))
    .addStringOption((opt) => opt.setName('motivo').setDescription('Motivo da advertência').setRequired(true)),
  name: 'advertir',
  category: 'Membros',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    const alvo = interaction.options.getUser('membro');
    const motivo = interaction.options.getString('motivo');

    let membro = await Membro.findOne({ discordId: alvo.id });
    if (!membro) {
      // Cria registro se não existir
      membro = await Membro.create({
        discordId: alvo.id,
        nickname: alvo.username,
        cargo: 'membro',
      });
    }

    // Adiciona advertência
    membro.advertencias.push({
      motivo,
      advertidoPor: interaction.user.id,
      data: new Date(),
    });
    await membro.save();

    const totalAdvertencias = membro.advertencias.length;

    // Verifica limite de advertências
    if (totalAdvertencias >= config.geral.maxAdvertencias) {
      await interaction.reply({
        embeds: [
          criarEmbedAviso(
            'Limite de advertências atingido',
            `**${alvo.tag}** atingiu **${totalAdvertencias}** advertência(s). Considere expulsar este membro usando \`/expulsar\`.`,
          ),
        ],
      });
    } else {
      await interaction.reply({
        embeds: [
          criarEmbedSucesso(
            'Advertência registrada',
            `**${alvo.tag}** recebeu uma advertência.\n**Motivo:** ${motivo}\n**Total de advertências:** ${totalAdvertencias}/${config.geral.maxAdvertencias}`,
          ),
        ],
      });
    }

    await registrarLog(client, 'advertencia', interaction.user.id, alvo.id, `Advertência ${totalAdvertencias}/${config.geral.maxAdvertencias}. Motivo: ${motivo}`);
  },
};
