/**
 * SelectMenu: membros_confirmar_rebaixar_ (prefixo)
 * Confirma o rebaixamento do membro ao cargo selecionado.
 */

const config = require('../Config/config');
const { criarEmbedSucesso } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');
const { Membro } = require('../Database');

module.exports = {
  customId: 'membros_confirmar_rebaixar_',
  async execute(interaction, client) {
    const discordId = interaction.customId.replace('membros_confirmar_rebaixar_', '');
    const cargoNovo = interaction.values[0];

    const membro = await Membro.findOne({ discordId });
    if (!membro) {
      return interaction.reply({ content: '❌ Membro não encontrado.', ephemeral: true });
    }

    const cargoAntigo = membro.cargo;
    membro.cargo = cargoNovo;
    await membro.save();

    const cargoDiscord = config.cargos[cargoNovo];
    if (cargoDiscord && !cargoDiscord.startsWith('ID_')) {
      try {
        const membroDiscord = await interaction.guild.members.fetch(discordId);
        await membroDiscord.roles.add(cargoDiscord);
        const cargoAntigoDiscord = config.cargos[cargoAntigo];
        if (cargoAntigoDiscord && !cargoAntigoDiscord.startsWith('ID_')) {
          await membroDiscord.roles.remove(cargoAntigoDiscord);
        }
      } catch (e) {
        console.warn('Erro ao atualizar cargos:', e.message);
      }
    }

    await interaction.update({
      embeds: [criarEmbedSucesso('Membro rebaixado', `**${membro.nickname || discordId}** foi rebaixado de **${cargoAntigo}** para **${cargoNovo}**.`)],
      components: [],
    });

    await registrarLog(client, 'membro_rebaixado', interaction.user.id, discordId, `Rebaixado de ${cargoAntigo} para ${cargoNovo}`);
  },
};
