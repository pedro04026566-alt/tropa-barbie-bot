/**
 * Comando: /painel-tickets
 * Exibe o painel de tickets público com menu de seleção.
 */

const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('painel-tickets')
    .setDescription('Exibe o painel de tickets da facção'),
  name: 'painel-tickets',
  category: 'Admin',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

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
      footer: `${config.faccao.nome} | Tickets`,
    });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticket_selecionar')
        .setPlaceholder('Selecione o tipo de ticket...')
        .addOptions([
          {
            label: 'Suporte',
            description: 'Dúvidas e problemas gerais',
            value: 'suporte',
            emoji: '🛟',
          },
          {
            label: 'Denúncia',
            description: 'Reportar comportamento inadequado',
            value: 'denuncia',
            emoji: '⚠️',
          },
          {
            label: 'Recrutamento',
            description: 'Questões sobre o recrutamento',
            value: 'recrutamento',
            emoji: '📝',
          },
        ]),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
