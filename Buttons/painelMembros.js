/**
 * Botão: painel_membros
 * Exibe o painel de gerenciamento de membros.
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');

module.exports = {
  customId: 'painel_membros',
  async execute(interaction, client) {
    const embed = criarEmbedBasica({
      titulo: '👥 Gerenciamento de Membros',
      descricao: 'Selecione uma ação para gerenciar os membros da facção:',
      cor: config.cores.primaria,
    });

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('membros_promover').setLabel('Promover').setEmoji('⬆️').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('membros_rebaixar').setLabel('Rebaixar').setEmoji('⬇️').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('membros_expulsar').setLabel('Expulsar').setEmoji('👢').setStyle(ButtonStyle.Danger),
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('membros_advertir').setLabel('Advertir').setEmoji('⚠️').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('membros_ver_membro').setLabel('Ver Membro').setEmoji('👤').setStyle(ButtonStyle.Primary),
    );

    await interaction.update({ embeds: [embed], components: [row1, row2] });
  },
};
