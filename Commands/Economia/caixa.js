/**
 * Comando: /caixa
 * Exibe o saldo atual da facção e as últimas movimentações.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { formatarMoeda, formatarData } = require('../../Utils/helpers');
const { Economia, Configuracao } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('caixa')
    .setDescription('Exibe o saldo e as últimas movimentações da facção'),
  name: 'caixa',
  category: 'Economia',
  requireAuth: false,
  async execute(interaction, client) {
    await interaction.deferReply();

    // Busca o saldo atual
    let configDb = await Configuracao.findOne({ guildId: interaction.guild.id });
    const saldo = configDb?.economiaSaldo || 0;

    // Busca as últimas 5 transações
    const transacoes = await Economia.find().sort({ data: -1 }).limit(5);

    const embed = criarEmbedBasica({
      titulo: '💰 Caixa da Facção — Tropa da Barbie',
      descricao: `**Saldo atual:** ${formatarMoeda(saldo)}`,
      cor: config.cores.primaria,
    });

    if (transacoes.length > 0) {
      const transacoesTexto = transacoes
        .map((t) => {
          const icone = t.tipo === 'entrada' ? '📥' : '📤';
          const sinal = t.tipo === 'entrada' ? '+' : '-';
          return `${icone} ${sinal}${formatarMoeda(t.valor)} — ${t.descricao}\n*${formatarData(t.data)}*`;
        })
        .join('\n\n');
      embed.addFields({ name: '📋 Últimas Movimentações', value: transacoesTexto, inline: false });
    } else {
      embed.addFields({ name: '📋 Últimas Movimentações', value: 'Nenhuma movimentação registrada.', inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
