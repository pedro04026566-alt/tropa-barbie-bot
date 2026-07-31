/**
 * Botão: op_checkin_ (prefixo)
 * Registra presença confirmada em uma operação.
 */

const config = require('../Config/config');
const { criarEmbedSucesso } = require('../Utils/embeds');
const { Operacao } = require('../Database');

module.exports = {
  customId: 'op_checkin_',
  async execute(interaction, client) {
    // Extrai o ID da operação do customId
    const opId = interaction.customId.replace('op_checkin_', '');

    // Busca a operação pelo ID gerado (usado como referência)
    // Como não salvamos o opId no banco, buscamos por tipo e status agendada
    const operacoes = await Operacao.find({ status: 'agendada' }).sort({ dataCriacao: -1 }).limit(1);
    const op = operacoes[0];

    if (!op) {
      return interaction.reply({ content: '❌ Operação não encontrada.', ephemeral: true });
    }

    // Verifica se o usuário já está na lista
    if (op.participantes.includes(interaction.user.id)) {
      return interaction.reply({ content: '✅ Você já confirmou presença nesta operação.', ephemeral: true });
    }

    op.participantes.push(interaction.user.id);
    await op.save();

    await interaction.reply({
      embeds: [criarEmbedSucesso('Presença confirmada', `Sua presença foi confirmada para **${op.titulo}**!`)],
      ephemeral: true,
    });
  },
};
