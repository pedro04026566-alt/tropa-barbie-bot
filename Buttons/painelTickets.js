/**
 * Botão: painel_tickets
 * Exibe o painel de tickets ao clicar no botão do painel principal.
 */

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');

module.exports = {
  customId: 'painel_tickets',
  async execute(interaction, client) {
    const embed = criarEmbedBasica({
      titulo: '🎫 Sistema de Tickets',
      descricao: [
        'Selecione o tipo de atendimento:',
        '• **Suporte** — Dúvidas e problemas gerais',
        '• **Denúncia** — Reportar comportamento inadequado',
        '• **Recrutamento** — Questões sobre o processo seletivo',
      ].join('\n'),
      cor: config.cores.primaria,
    });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticket_selecionar')
        .setPlaceholder('Selecione o tipo de ticket...')
        .addOptions([
          { label: 'Suporte', description: 'Dúvidas e problemas gerais', value: 'suporte', emoji: '🛟' },
          { label: 'Denúncia', description: 'Reportar comportamento inadequado', value: 'denuncia', emoji: '⚠️' },
          { label: 'Recrutamento', description: 'Questões sobre o recrutamento', value: 'recrutamento', emoji: '📝' },
        ]),
    );

    await interaction.update({ embeds: [embed], components: [row] });
  },
};
