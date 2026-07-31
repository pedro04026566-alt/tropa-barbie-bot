/**
 * Comando: /painel-recrutamento
 * Exibe o painel de recrutamento público com botão para iniciar candidatura.
 */

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('painel-recrutamento')
    .setDescription('Exibe o painel de recrutamento da facção'),
  name: 'painel-recrutamento',
  category: 'Admin',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    const embed = criarEmbedBasica({
      titulo: '📝 Recrutamento — Tropa da Barbie',
      descricao: [
        'Quer fazer parte da **Tropa da Barbie**? 🌸',
        '',
        '**Requisitos:**',
        '• Idade mínima: 16 anos',
        '• Ter Discord e microfone funcionando',
        '• Disponibilidade para operações',
        '• Respeitar as regras da facção',
        '',
        'Clique no botão abaixo para iniciar sua candidatura!',
      ].join('\n'),
      cor: config.cores.primaria,
      footer: `${config.faccao.nome} | Recrutamento`,
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('recrutamento_abrir')
        .setLabel('Iniciar Recrutamento')
        .setEmoji('🌸')
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
