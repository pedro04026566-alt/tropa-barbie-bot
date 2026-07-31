/**
 * Botão: membros_advertir
 * Mostra um select menu com membros para advertir.
 */

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');
const { Membro } = require('../Database');

module.exports = {
  customId: 'membros_advertir',
  async execute(interaction, client) {
    const membros = await Membro.find({ status: 'ativo' }).limit(25);

    if (membros.length === 0) {
      return interaction.reply({ content: '❌ Nenhum membro ativo encontrado.', ephemeral: true });
    }

    const opcoes = membros.map((m) => ({
      label: m.nickname || m.discordId,
      description: `Advertências: ${m.advertencias.length}/${config.geral.maxAdvertencias}`,
      value: m.discordId,
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('membros_selecionar_advertir')
        .setPlaceholder('Selecione um membro para advertir...')
        .addOptions(opcoes),
    );

    await interaction.reply({
      embeds: [criarEmbedBasica({ titulo: 'Advertir Membro', descricao: 'Selecione o membro que deseja advertir:', cor: config.cores.aviso })],
      components: [row],
      ephemeral: true,
    });
  },
};
