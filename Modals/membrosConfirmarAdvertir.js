/**
 * Modal: membros_confirmar_advertir_ (prefixo)
 * Processa a advertência do membro com motivo.
 */

const config = require('../Config/config');
const { criarEmbedSucesso, criarEmbedAviso } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');
const { Membro } = require('../Database');

module.exports = {
  customId: 'membros_confirmar_advertir_',
  async execute(interaction, client) {
    const discordId = interaction.customId.replace('membros_confirmar_advertir_', '');
    const motivo = interaction.fields.getTextInputValue('motivo');

    let membro = await Membro.findOne({ discordId });
    if (!membro) {
      membro = await Membro.create({ discordId, nickname: '', cargo: 'membro' });
    }

    membro.advertencias.push({
      motivo,
      advertidoPor: interaction.user.id,
      data: new Date(),
    });
    await membro.save();

    const total = membro.advertencias.length;

    if (total >= config.geral.maxAdvertencias) {
      await interaction.reply({
        embeds: [criarEmbedAviso('Limite atingido', `**${membro.nickname || discordId}** atingiu ${total} advertências. Considere expulsar.`)],
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        embeds: [criarEmbedSucesso('Advertência registrada', `**${membro.nickname || discordId}** recebeu advertência ${total}/${config.geral.maxAdvertencias}.\n**Motivo:** ${motivo}`)],
        ephemeral: true,
      });
    }

    await registrarLog(client, 'advertencia', interaction.user.id, discordId, `Advertência ${total}/${config.geral.maxAdvertencias}: ${motivo}`);
  },
};
