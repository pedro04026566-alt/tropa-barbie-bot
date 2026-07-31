/**
 * Comando: /presenca
 * Sistema de check-in e check-out de presença.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso } = require('../../Utils/embeds');
const { formatarData, calcularTempoOnline } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');
const { Membro } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('presenca')
    .setDescription('Faz check-in ou check-out de presença'),
  name: 'presenca',
  category: 'Operacoes',
  requireAuth: false,
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    // Busca o membro no banco
    let membro = await Membro.findOne({ discordId: interaction.user.id });

    if (!membro) {
      // Cria registro automático
      membro = await Membro.create({
        discordId: interaction.user.id,
        nickname: interaction.user.username,
        cargo: 'membro',
      });
    }

    // Verifica se já tem check-in ativo
    if (membro.checkIn && !membro.checkOut) {
      // Faz check-out
      const tempo = calcularTempoOnline(membro.checkIn);
      membro.checkOut = new Date();
      membro.presencaTotal += 1;
      await membro.save();

      await interaction.editReply({
        embeds: [criarEmbedSucesso('Check-out registrado', `Você encerrou sua presença.\n**Tempo online:** ${tempo}\n**Total de presenças:** ${membro.presencaTotal}`)],
      });

      await registrarLog(client, 'presenca', interaction.user.id, '', `Check-out. Tempo: ${tempo}`);
    } else {
      // Faz check-in
      membro.checkIn = new Date();
      membro.checkOut = null;
      await membro.save();

      await interaction.editReply({
        embeds: [criarEmbedSucesso('Check-in registrado', `Presença iniciada em ${formatarData(new Date())}.\nUse \`/presenca\` novamente para fazer check-out.`)],
      });

      await registrarLog(client, 'presenca', interaction.user.id, '', 'Check-in registrado');
    }
  },
};
