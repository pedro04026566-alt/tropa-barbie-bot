/**
 * SelectMenu: ticket_selecionar
 * Processa a seleção do tipo de ticket e abre o modal de motivo.
 */

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../Config/config');

module.exports = {
  customId: 'ticket_selecionar',
  async execute(interaction, client) {
    const tipo = interaction.values[0];

    // Armazena o tipo temporariamente
    client.ticketTipo.set(interaction.user.id, tipo);

    // Abre o modal para descrever o motivo
    const modal = new ModalBuilder()
      .setCustomId('ticket_motivo')
      .setTitle('🎫 Descreva seu Ticket');

    const motivo = new TextInputBuilder()
      .setCustomId('motivo')
      .setLabel('Descreva seu problema/solicitação')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(1000);

    modal.addComponents(new ActionRowBuilder().addComponents(motivo));

    await interaction.showModal(modal);
  },
};
