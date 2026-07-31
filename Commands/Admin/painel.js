/**
 * Comando: /painel
 * Exibe o painel administrativo principal com botões de navegação.
 * Acesso restrito a cargos autorizados.
 */

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('painel')
    .setDescription('Exibe o painel administrativo da facção'),
  name: 'painel',
  category: 'Admin',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({
        content: config.mensagens.semPermissao,
        ephemeral: true,
      });
    }

    const embed = criarEmbedBasica({
      titulo: '🌸 Painel Administrativo — Tropa da Barbie',
      descricao: [
        'Bem-vindo ao painel de administração da facção!',
        '',
        'Use os botões abaixo para navegar entre os sistemas:',
        '• **Recrutamento** — Gerencie candidaturas',
        '• **Tickets** — Sistema de suporte e denúncias',
        '• **Regras** — Visualize as regras da facção',
        '• **Informações** — Dados gerais da facção',
        '• **Membros** — Gerencie membros e cargos',
        '• **Economia** — Controle financeiro',
        '• **Anúncios** — Divulgue comunicados',
        '• **Estatísticas** — Dados e métricas',
      ].join('\n'),
      cor: config.cores.primaria,
    });

    // Linha 1 de botões
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('painel_recrutamento')
        .setLabel('Recrutamento')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('painel_tickets')
        .setLabel('Tickets')
        .setEmoji('🎫')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('painel_regras')
        .setLabel('Regras')
        .setEmoji('📋')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('painel_informacoes')
        .setLabel('Informações')
        .setEmoji('ℹ️')
        .setStyle(ButtonStyle.Primary),
    );

    // Linha 2 de botões
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('painel_membros')
        .setLabel('Membros')
        .setEmoji('👥')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('painel_economia')
        .setLabel('Economia')
        .setEmoji('💰')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('painel_anuncios')
        .setLabel('Anúncios')
        .setEmoji('📢')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('painel_estatisticas')
        .setLabel('Estatísticas')
        .setEmoji('📊')
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({ embeds: [embed], components: [row1, row2] });
  },
};
