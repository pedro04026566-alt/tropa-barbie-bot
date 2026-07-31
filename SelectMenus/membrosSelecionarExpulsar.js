/**
 * SelectMenu: membros_selecionar_expulsar
 * Após selecionar um membro, pede motivo e expulsa.
 */

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { Membro } = require('../../Database');

module.exports = {
  customId: 'membros_selecionar_expulsar',
  async execute(interaction, client) {
    const discordId = interaction.values[0];

    const membro = await Membro.findOne({ discordId });
    if (!membro) {
      return interaction.reply({ content: '❌ Membro não encontrado.', ephemeral: true });
    }

    // Armazena o ID temporariamente e abre modal de motivo
    client.ticketTipo.set(`expulsar_${interaction.user.id}`, discordId);

    const modal = new ModalBuilder()
      .setCustomId(`membros_confirmar_expulsar_${discordId}`)
      .setTitle('👢 Motivo da Expulsão');

    const motivo = new TextInputBuilder()
      .setCustomId('motivo')
      .setLabel('Motivo da expulsão')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(500);

    modal.addComponents(new ActionRowBuilder().addComponents(motivo));

    await interaction.showModal(modal);
  },
};
