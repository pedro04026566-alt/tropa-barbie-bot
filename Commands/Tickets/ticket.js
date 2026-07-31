/**
 * Comando: /ticket
 * Exibe o painel de tickets para o usuário selecionar o tipo.
 */

const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abre o painel de tickets'),
  name: 'ticket',
  category: 'Tickets',
  requireAuth: false,
  async execute(interaction, client) {
    const embed = criarEmbedBasica({
      titulo: '🎫 Sistema de Tickets — Tropa da Barbie',
      descricao: [
        'Precisa de ajuda? Abra um ticket!',
        '',
        'Selecione o tipo de atendimento no menu abaixo:',
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

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
