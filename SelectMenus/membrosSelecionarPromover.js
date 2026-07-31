/**
 * SelectMenu: membros_selecionar_promover
 * Após selecionar um membro, mostra escolha de cargo para promover.
 */

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica, criarEmbedSucesso } = require('../../Utils/embeds');
const { registrarLog } = require('../../Utils/logger');
const { Membro } = require('../../Database');

module.exports = {
  customId: 'membros_selecionar_promover',
  async execute(interaction, client) {
    const discordId = interaction.values[0];

    const membro = await Membro.findOne({ discordId });
    if (!membro) {
      return interaction.reply({ content: '❌ Membro não encontrado.', ephemeral: true });
    }

    // Mostra cargos disponíveis para promoção
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`membros_confirmar_promover_${discordId}`)
        .setPlaceholder('Selecione o novo cargo...')
        .addOptions([
          { label: 'Membro', value: 'membro', emoji: '👤' },
          { label: 'Moderador', value: 'moderador', emoji: '🛡️' },
          { label: 'Admin', value: 'admin', emoji: '🔧' },
          { label: 'Sublíder', value: 'sublider', emoji: '⭐' },
          { label: 'Líder', value: 'lider', emoji: '👑' },
        ]),
    );

    await interaction.update({
      embeds: [criarEmbedBasica({
        titulo: 'Promover Membro',
        descricao: `Membro: **${membro.nickname || discordId}**\nCargo atual: **${membro.cargo}**\n\nSelecione o novo cargo:`,
        cor: config.cores.sucesso,
      })],
      components: [row],
    });
  },
};
