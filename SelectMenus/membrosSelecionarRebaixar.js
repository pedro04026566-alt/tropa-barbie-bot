/**
 * SelectMenu: membros_selecionar_rebaixar
 * Após selecionar um membro, mostra escolha de cargo para rebaixar.
 */

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');
const { Membro } = require('../Database');

module.exports = {
  customId: 'membros_selecionar_rebaixar',
  async execute(interaction, client) {
    const discordId = interaction.values[0];

    const membro = await Membro.findOne({ discordId });
    if (!membro) {
      return interaction.reply({ content: '❌ Membro não encontrado.', ephemeral: true });
    }

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`membros_confirmar_rebaixar_${discordId}`)
        .setPlaceholder('Selecione o novo cargo...')
        .addOptions([
          { label: 'Recruta', value: 'recruta', emoji: '🌸' },
          { label: 'Membro', value: 'membro', emoji: '👤' },
          { label: 'Moderador', value: 'moderador', emoji: '🛡️' },
        ]),
    );

    await interaction.update({
      embeds: [criarEmbedBasica({
        titulo: 'Rebaixar Membro',
        descricao: `Membro: **${membro.nickname || discordId}**\nCargo atual: **${membro.cargo}**\n\nSelecione o novo cargo:`,
        cor: config.cores.aviso,
      })],
      components: [row],
    });
  },
};
