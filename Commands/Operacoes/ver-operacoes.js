/**
 * Comando: /ver-operacoes
 * Lista as operações/treinamentos/reuniões da facção.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { formatarData } = require('../../Utils/helpers');
const { Operacao } = require('../../Database');

const iconesTipo = {
  treinamento: '🏋️',
  reuniao: '📢',
  operacao: '🎯',
};

const iconesStatus = {
  agendada: '📅 Agendada',
  em_andamento: '🔄 Em andamento',
  finalizada: '✅ Finalizada',
  cancelada: '❌ Cancelada',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ver-operacoes')
    .setDescription('Lista operações, treinamentos e reuniões')
    .addStringOption((opt) =>
      opt.setName('status')
        .setDescription('Filtrar por status')
        .setRequired(false)
        .addChoices(
          { name: 'Agendada', value: 'agendada' },
          { name: 'Em andamento', value: 'em_andamento' },
          { name: 'Finalizada', value: 'finalizada' },
          { name: 'Cancelada', value: 'cancelada' },
        ),
    ),
  name: 'ver-operacoes',
  category: 'Operacoes',
  requireAuth: false,
  async execute(interaction, client) {
    await interaction.deferReply();

    const status = interaction.options.getString('status');
    const filtro = status ? { status } : {};
    const operacoes = await Operacao.find(filtro).sort({ data: -1 }).limit(15);

    const embed = criarEmbedBasica({
      titulo: '📋 Operações — Tropa da Barbie',
      descricao: status ? `Filtrando por: **${iconesStatus[status] || status}**` : 'Todas as operações recentes:',
      cor: config.cores.primaria,
    });

    if (operacoes.length === 0) {
      embed.addFields({ name: 'Nenhuma operação', value: 'Não há operações registradas com este filtro.', inline: false });
    } else {
      const lista = operacoes
        .map((op) => `${iconesTipo[op.tipo] || '📋'} **${op.titulo}** — ${iconesStatus[op.status] || op.status}\n> ${formatarData(op.data)} • ${op.participantes.length} participantes`)
        .join('\n\n');
      embed.addFields({ name: 'Operações', value: lista.slice(0, 1024), inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
