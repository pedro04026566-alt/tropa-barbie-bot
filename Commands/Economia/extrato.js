/**
 * Comando: /extrato
 * Exibe o histórico de transações da facção.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { formatarMoeda, formatarData } = require('../../Utils/helpers');
const { Economia } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('extrato')
    .setDescription('Exibe o histórico de transações')
    .addIntegerOption((opt) => opt.setName('quantidade').setDescription('Número de transações (máx: 50)').setMinValue(1).setMaxValue(50)),
  name: 'extrato',
  category: 'Economia',
  requireAuth: false,
  async execute(interaction, client) {
    await interaction.deferReply();

    const quantidade = interaction.options.getInteger('quantidade') || 10;

    const transacoes = await Economia.find().sort({ data: -1 }).limit(quantidade);

    const embed = criarEmbedBasica({
      titulo: '📋 Extrato — Tropa da Barbie',
      descricao: `Últimas ${transacoes.length} transações:`,
      cor: config.cores.primaria,
    });

    if (transacoes.length === 0) {
      embed.addFields({ name: 'Sem transações', value: 'Nenhuma movimentação registrada ainda.', inline: false });
    } else {
      const extrato = transacoes
        .map((t, i) => {
          const icone = t.tipo === 'entrada' ? '🟢' : '🔴';
          const sinal = t.tipo === 'entrada' ? '+' : '-';
          return `${icone} **${i + 1}.** ${sinal}${formatarMoeda(t.valor)} — ${t.descricao}\n> *${formatarData(t.data)} • Saldo: ${formatarMoeda(t.saldoApos)}*`;
        })
        .join('\n\n');
      embed.addFields({ name: 'Transações', value: extrato.slice(0, 1024), inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
