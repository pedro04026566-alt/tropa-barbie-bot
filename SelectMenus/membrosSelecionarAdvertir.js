/**
 * SelectMenu: membros_selecionar_advertir
 * Após selecionar um membro, pede motivo e registra advertência.
 */

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../Config/config');
const { Membro } = require('../../Database');

module.exports = {
  customId: 'membros_selecionar_advertir',
  async execute(interaction, client) {
    const discordId = interaction.values[0];

    const membro = await Membro.findOne({ discordId });
    if (!membro) {
      return interaction.reply({ content: '❌ Membro não encontrado.', ephemeral: true });
    }

    const modal = new ModalBuilder()
      .setCustomId(`membros_confirmar_advertir_${discordId}`)
      .setTitle('⚠️ Motivo da Advertência');

    const motivo = new TextInputBuilder()
      .setCustomId('motivo')
      .setLabel('Motivo da advertência')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(500);

    modal.addComponents(new ActionRowBuilder().addComponents(motivo));

    await interaction.showModal(modal);
  },
};
