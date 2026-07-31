/**
 * Botão: membros_promover
 * Mostra um select menu com membros para promover.
 */

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { Membro } = require('../../Database');

module.exports = {
  customId: 'membros_promover',
  async execute(interaction, client) {
    const membros = await Membro.find({ status: 'ativo' }).limit(25);

    if (membros.length === 0) {
      return interaction.reply({ content: '❌ Nenhum membro ativo encontrado.', ephemeral: true });
    }

    const opcoes = membros.map((m) => ({
      label: m.nickname || m.discordId,
      description: `Cargo: ${m.cargo}`,
      value: m.discordId,
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('membros_selecionar_promover')
        .setPlaceholder('Selecione um membro para promover...')
        .addOptions(opcoes),
    );

    await interaction.reply({
      embeds: [criarEmbedBasica({ titulo: 'Promover Membro', descricao: 'Selecione o membro que deseja promover:', cor: config.cores.sucesso })],
      components: [row],
      ephemeral: true,
    });
  },
};
