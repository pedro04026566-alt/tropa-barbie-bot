/**
 * Botão: membros_rebaixar
 * Mostra um select menu com membros para rebaixar.
 */

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');
const { Membro } = require('../Database');

module.exports = {
  customId: 'membros_rebaixar',
  async execute(interaction, client) {
    const membros = await Membro.find({ status: 'ativo', cargo: { $ne: 'recruta' } }).limit(25);

    if (membros.length === 0) {
      return interaction.reply({ content: '❌ Nenhum membro elegível para rebaixamento.', ephemeral: true });
    }

    const opcoes = membros.map((m) => ({
      label: m.nickname || m.discordId,
      description: `Cargo atual: ${m.cargo}`,
      value: m.discordId,
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('membros_selecionar_rebaixar')
        .setPlaceholder('Selecione um membro para rebaixar...')
        .addOptions(opcoes),
    );

    await interaction.reply({
      embeds: [criarEmbedBasica({ titulo: 'Rebaixar Membro', descricao: 'Selecione o membro que deseja rebaixar:', cor: config.cores.aviso })],
      components: [row],
      ephemeral: true,
    });
  },
};
