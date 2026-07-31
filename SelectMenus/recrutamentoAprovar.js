/**
 * SelectMenu: recrutamento_aprovar_ (prefixo)
 * Aprova uma candidatura de recrutamento.
 */

const config = require('../../Config/config');
const { criarEmbedSucesso } = require('../../Utils/embeds');
const { registrarLog } = require('../../Utils/logger');
const { Recrutamento, Membro } = require('../../Database');

module.exports = {
  customId: 'recrutamento_aprovar_',
  async execute(interaction, client) {
    // Extrai o ID da candidatura
    const candidaturaId = interaction.customId.replace('recrutamento_aprovar_', '');

    const candidatura = await Recrutamento.findById(candidaturaId);
    if (!candidatura) {
      return interaction.reply({ content: '❌ Candidatura não encontrada.', ephemeral: true });
    }

    if (candidatura.status !== 'pendente') {
      return interaction.reply({ content: '❌ Esta candidatura já foi processada.', ephemeral: true });
    }

    // Aprova a candidatura
    candidatura.status = 'aprovado';
    candidatura.decididoPor = interaction.user.id;
    candidatura.dataDecisao = new Date();
    await candidatura.save();

    // Cria o membro no banco
    await Membro.findOneAndUpdate(
      { discordId: candidatura.discordId },
      {
        $setOnInsert: {
          discordId: candidatura.discordId,
          nickname: candidatura.nickname,
          cargo: 'recruta',
          dataEntrada: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    // Envia mensagem no canal de aprovados
    const canalId = config.canais.aprovados;
    if (canalId && canalId !== 'ID_CANAL_APROVADOS') {
      const canal = await client.channels.fetch(canalId).catch(() => null);
      if (canal) {
        const embed = criarEmbedSucesso(
          'Candidatura Aprovada',
          `🌸 Parabéns, <@${candidatura.discordId}>!\n\nVocê foi **APROVADO(A)** na **${config.faccao.nome}**!\n\nBem-vindo(a) à família! 🌸`,
        );
        await canal.send({ content: `<@${candidatura.discordId}>`, embeds: [embed] });
      }
    }

    await interaction.update({
      embeds: [criarEmbedSucesso('Candidatura aprovada', `**${candidatura.nickname}** foi aprovado(a) com sucesso!`)],
      components: [],
    });

    await registrarLog(client, 'recrutamento_decisao', interaction.user.id, candidatura.discordId, `Aprovado: ${candidatura.nickname}`);
  },
};
