/**
 * Comando: /fechar-ticket
 * Fecha o ticket atual (usável dentro de canais de ticket).
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso, criarEmbedErro } = require('../../Utils/embeds');
const { registrarLog } = require('../../Utils/logger');
const { Ticket } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fechar-ticket')
    .setDescription('Fecha o ticket atual'),
  name: 'fechar-ticket',
  category: 'Tickets',
  requireAuth: false,
  async execute(interaction, client) {
    // Verifica se está em um canal de ticket
    const ticket = await Ticket.findOne({ channelId: interaction.channelId, status: 'aberto' });
    if (!ticket) {
      return interaction.reply({ embeds: [criarEmbedErro('Não é um ticket', 'Este comando só pode ser usado em canais de ticket abertos.')], ephemeral: true });
    }

    // Atualiza no banco
    ticket.status = 'fechado';
    ticket.dataFechamento = new Date();
    ticket.fechadoPor = interaction.user.id;
    await ticket.save();

    await interaction.reply({ embeds: [criarEmbedSucesso('Ticket fechado', 'Este ticket será fechado em 5 segundos...')] });

    await registrarLog(client, 'ticket_fechado', interaction.user.id, ticket.userId, `Ticket ${ticket.ticketId} fechado`);

    // Aguarda 5 segundos e deleta o canal
    setTimeout(async () => {
      try {
        const canal = await client.channels.fetch(interaction.channelId).catch(() => null);
        if (canal) await canal.delete('Ticket fechado');
      } catch (e) {
        console.error('Erro ao deletar canal de ticket:', e.message);
      }
    }, 5000);
  },
};
