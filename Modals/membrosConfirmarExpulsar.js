/**
 * Modal: membros_confirmar_expulsar_ (prefixo)
 * Processa a expulsão do membro com motivo.
 */

const config = require('../Config/config');
const { criarEmbedSucesso } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');
const { Membro } = require('../Database');

module.exports = {
  customId: 'membros_confirmar_expulsar_',
  async execute(interaction, client) {
    const discordId = interaction.customId.replace('membros_confirmar_expulsar_', '');
    const motivo = interaction.fields.getTextInputValue('motivo');

    const membro = await Membro.findOne({ discordId });
    if (!membro) {
      return interaction.reply({ content: '❌ Membro não encontrado.', ephemeral: true });
    }

    membro.status = 'expulso';
    await membro.save();

    // Remove cargos no Discord
    try {
      const membroDiscord = await interaction.guild.members.fetch(discordId);
      const cargos = [config.cargos.membro, config.cargos.recruta, config.cargos.moderador, config.cargos.admin, config.cargos.sublider];
      for (const cargoId of cargos) {
        if (cargoId && !cargoId.startsWith('ID_')) {
          await membroDiscord.roles.remove(cargoId).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Erro ao remover cargos:', e.message);
    }

    await interaction.reply({
      embeds: [criarEmbedSucesso('Membro expulso', `**${membro.nickname || discordId}** foi expulso.\n**Motivo:** ${motivo}`)],
      ephemeral: true,
    });

    await registrarLog(client, 'membro_expulso', interaction.user.id, discordId, `Expulso. Motivo: ${motivo}`);
  },
};
