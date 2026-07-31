/**
 * Botão: op_checkout_ (prefixo)
 * Remove a presença de uma operação.
 */

const config = require('../../Config/config');
const { criarEmbedSucesso } = require('../../Utils/embeds');
const { Operacao } = require('../../Database');

module.exports = {
  customId: 'op_checkout_',
  async execute(interaction, client) {
    const opId = interaction.customId.replace('op_checkout_', '');

    const operacoes = await Operacao.find({ status: 'agendada' }).sort({ dataCriacao: -1 }).limit(1);
    const op = operacoes[0];

    if (!op) {
      return interaction.reply({ content: '❌ Operação não encontrada.', ephemeral: true });
    }

    // Remove o usuário da lista de participantes
    op.participantes = op.participantes.filter((id) => id !== interaction.user.id);
    await op.save();

    await interaction.reply({
      embeds: [criarEmbedSucesso('Presença removida', `Sua presença foi removida de **${op.titulo}**.`)],
      ephemeral: true,
    });
  },
};
