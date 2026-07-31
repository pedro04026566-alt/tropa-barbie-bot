/**
 * Botão: membros_ver_membro
 * Mostra um select menu com membros para visualizar.
 */

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { Membro } = require('../../Database');

module.exports = {
  customId: 'membros_ver_membro',
  async execute(interaction, client) {
    const membros = await Membro.find().limit(25);

    if (membros.length === 0) {
      return interaction.reply({ content: '❌ Nenhum membro encontrado.', ephemeral: true });
    }

    const opcoes = membros.map((m) => ({
      label: m.nickname || m.discordId,
      description: `${m.cargo} • ${m.status}`,
      value: m.discordId,
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('membros_selecionar_ver')
        .setPlaceholder('Selecione um membro para visualizar...')
        .addOptions(opcoes),
    );

    await interaction.reply({
      embeds: [criarEmbedBasica({ titulo: 'Ver Membro', descricao: 'Selecione um membro para ver suas informações:', cor: config.cores.info })],
      components: [row],
      ephemeral: true,
    });
  },
};
