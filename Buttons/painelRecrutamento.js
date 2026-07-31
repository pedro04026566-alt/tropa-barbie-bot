/**
 * Botão: painel_recrutamento
 * Exibe o painel de recrutamento ao clicar no botão do painel principal.
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');

module.exports = {
  customId: 'painel_recrutamento',
  async execute(interaction, client) {
    const embed = criarEmbedBasica({
      titulo: '📝 Recrutamento — Tropa da Barbie',
      descricao: [
        'Quer fazer parte da **Tropa da Barbie**? 🌸',
        '',
        '**Requisitos:**',
        '• Idade mínima: 16 anos',
        '• Ter Discord e microfone',
        '• Disponibilidade para operações',
        '• Respeitar as regras da facção',
        '',
        'Clique no botão abaixo para iniciar sua candidatura!',
      ].join('\n'),
      cor: config.cores.primaria,
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('recrutamento_abrir')
        .setLabel('Iniciar Recrutamento')
        .setEmoji('🌸')
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.update({ embeds: [embed], components: [row] });
  },
};
