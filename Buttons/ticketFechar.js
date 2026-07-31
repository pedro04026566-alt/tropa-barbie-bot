/**
 * Botão: ticket_fechar
 * Fecha o ticket atual e deleta o canal.
 */

const config = require('../Config/config');
const { criarEmbedSucesso } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');
const { Ticket } = require('../Database');

module.exports = {
  customId: 'ticket_fechar',
  async execute(interaction, client) {
    const ticket = await Ticket.findOne({ channelId: interaction.channelId, status: 'aberto' });
    if (!ticket) {
      return interaction.reply({ content: '❌ Este não é um canal de ticket ativo.', ephemeral: true });
    }

    ticket.status = 'fechado';
    ticket.dataFechamento = new Date();
    ticket.fechadoPor = interaction.user.id;
    await ticket.save();

    await interaction.reply({ embeds: [criarEmbedSucesso('Ticket fechado', 'Este ticket será fechado em 5 segundos...')] });

    await registrarLog(client, 'ticket_fechado', interaction.user.id, ticket.userId, `Ticket ${ticket.ticketId} fechado`);

    setTimeout(async () => {
      try {
        const canal = await client.channels.fetch(interaction.channelId).catch(() => null);
        if (canal) await canal.delete('Ticket fechado');
      } catch (e) {
        console.error('Erro ao deletar canal:', e.message);
      }
    }, 5000);
  },
};
