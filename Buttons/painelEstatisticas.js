/**
 * Botão: painel_estatisticas
 * Exibe estatísticas gerais da facção.
 */

const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');
const { Membro, Operacao, Ticket, Economia, Configuracao } = require('../Database');
const { formatarMoeda } = require('../Utils/helpers');

module.exports = {
  customId: 'painel_estatisticas',
  async execute(interaction, client) {
    const totalMembros = await Membro.countDocuments({ status: 'ativo' });
    const totalRecrutas = await Membro.countDocuments({ cargo: 'recruta', status: 'ativo' });
    const totalOperacoes = await Operacao.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const totalTransacoes = await Economia.countDocuments();
    const configDb = await Configuracao.findOne({ guildId: interaction.guild.id });
    const saldo = configDb?.economiaSaldo || 0;

    const embed = criarEmbedBasica({
      titulo: '📊 Estatísticas — Tropa da Barbie',
      descricao: 'Dados gerais da facção:',
      cor: config.cores.primaria,
    });

    embed.addFields(
      { name: '👥 Membros Ativos', value: `${totalMembros}`, inline: true },
      { name: '🌸 Recrutas', value: `${totalRecrutas}`, inline: true },
      { name: '🎯 Operações', value: `${totalOperacoes}`, inline: true },
      { name: '🎫 Tickets', value: `${totalTickets}`, inline: true },
      { name: '💰 Transações', value: `${totalTransacoes}`, inline: true },
      { name: '💵 Saldo', value: formatarMoeda(saldo), inline: true },
    );

    await interaction.update({ embeds: [embed], components: [] });
  },
};
