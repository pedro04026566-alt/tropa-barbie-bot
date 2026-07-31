/**
 * SelectMenu: recrutamento_reprovar_ (prefixo)
 * Reprova uma candidatura de recrutamento.
 */

const config = require('../../Config/config');
const { criarEmbedErro } = require('../../Utils/embeds');
const { registrarLog } = require('../../Utils/logger');
const { Recrutamento } = require('../../Database');

module.exports = {
  customId: 'recrutamento_reprovar_',
  async execute(interaction, client) {
    const candidaturaId = interaction.customId.replace('recrutamento_reprovar_', '');

    const candidatura = await Recrutamento.findById(candidaturaId);
    if (!candidatura) {
      return interaction.reply({ content: '❌ Candidatura não encontrada.', ephemeral: true });
    }

    if (candidatura.status !== 'pendente') {
      return interaction.reply({ content: '❌ Esta candidatura já foi processada.', ephemeral: true });
    }

    // Reprova a candidatura
    candidatura.status = 'reprovado';
    candidatura.decididoPor = interaction.user.id;
    candidatura.dataDecisao = new Date();
    await candidatura.save();

    // Envia mensagem no canal de reprovados
    const canalId = config.canais.reprovados;
    if (canalId && canalId !== 'ID_CANAL_REPROVADOS') {
      const canal = await client.channels.fetch(canalId).catch(() => null);
      if (canal) {
        const embed = criarEmbedErro(
          'Candidatura Reprovada',
          `Olá, <@${candidatura.discordId}>.\n\nSua candidatura para a **${config.faccao.nome}** foi **REPROVADA**.\n\nNão desanime! Você pode tentar novamente no futuro. 🌸`,
        );
        await canal.send({ content: `<@${candidatura.discordId}>`, embeds: [embed] });
      }
    }

    await interaction.update({
      embeds: [criarEmbedErro('Candidatura reprovada', `**${candidatura.nickname}** foi reprovado(a).`)],
      components: [],
    });

    await registrarLog(client, 'recrutamento_decisao', interaction.user.id, candidatura.discordId, `Reprovado: ${candidatura.nickname}`);
  },
};
