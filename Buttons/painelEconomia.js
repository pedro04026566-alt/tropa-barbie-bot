/**
 * Botão: painel_economia
 * Exibe o resumo financeiro da facção.
 */

const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');
const { formatarMoeda, formatarData } = require('../Utils/helpers');
const { Economia, Configuracao } = require('../Database');

module.exports = {
  customId: 'painel_economia',
  async execute(interaction, client) {
    let configDb = await Configuracao.findOne({ guildId: interaction.guild.id });
    const saldo = configDb?.economiaSaldo || 0;

    const transacoes = await Economia.find().sort({ data: -1 }).limit(5);

    const embed = criarEmbedBasica({
      titulo: '💰 Economia — Tropa da Barbie',
      descricao: `**Saldo atual:** ${formatarMoeda(saldo)}`,
      cor: config.cores.primaria,
    });

    if (transacoes.length > 0) {
      const texto = transacoes
        .map((t) => {
          const icone = t.tipo === 'entrada' ? '🟢' : '🔴';
          const sinal = t.tipo === 'entrada' ? '+' : '-';
          return `${icone} ${sinal}${formatarMoeda(t.valor)} — ${t.descricao}\n*${formatarData(t.data)}*`;
        })
        .join('\n\n');
      embed.addFields({ name: 'Últimas Movimentações', value: texto, inline: false });
    } else {
      embed.addFields({ name: 'Últimas Movimentações', value: 'Nenhuma transação registrada.', inline: false });
    }

    await interaction.update({ embeds: [embed], components: [] });
  },
};
