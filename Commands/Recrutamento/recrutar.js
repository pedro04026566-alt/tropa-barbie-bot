/**
 * Comando: /recrutar
 * Abre o formulário de recrutamento para o usuário preencher.
 */

const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../Config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recrutar')
    .setDescription('Inicia o processo de recrutamento da facção'),
  name: 'recrutar',
  category: 'Recrutamento',
  requireAuth: false,
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId('recrutamento_form')
      .setTitle('🌸 Recrutamento — Tropa da Barbie');

    // Campos do formulário
    const nickname = new TextInputBuilder()
      .setCustomId('nickname')
      .setLabel('Nickname In-Game')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(50);

    const idade = new TextInputBuilder()
      .setCustomId('idade')
      .setLabel('Idade')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(3);

    const experiencia = new TextInputBuilder()
      .setCustomId('experiencia')
      .setLabel('Experiência anterior em RP/FiveM')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(500);

    const steamId = new TextInputBuilder()
      .setCustomId('steamId')
      .setLabel('Steam ID')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(30);

    const motivo = new TextInputBuilder()
      .setCustomId('motivo')
      .setLabel('Por que quer entrar na Tropa da Barbie?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(500);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nickname),
      new ActionRowBuilder().addComponents(idade),
      new ActionRowBuilder().addComponents(experiencia),
      new ActionRowBuilder().addComponents(steamId),
      new ActionRowBuilder().addComponents(motivo),
    );

    await interaction.showModal(modal);
  },
};
