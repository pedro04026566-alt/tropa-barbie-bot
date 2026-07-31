/**
 * Comando: /treinamento
 * Agenda um treinamento da facção com botões de presença.
 */

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso, criarEmbedBasica, criarEmbedErro } = require('../../Utils/embeds');
const { temPermissao, formatarData, gerarId } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');
const { Operacao } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('treinamento')
    .setDescription('Agenda um treinamento')
    .addStringOption((opt) => opt.setName('titulo').setDescription('Título do treinamento').setRequired(true))
    .addStringOption((opt) => opt.setName('data').setDescription('Data (DD/MM/AAAA)').setRequired(true))
    .addStringOption((opt) => opt.setName('horario').setDescription('Horário (HH:MM)').setRequired(true))
    .addStringOption((opt) => opt.setName('descricao').setDescription('Descrição').setRequired(false)),
  name: 'treinamento',
  category: 'Operacoes',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    await interaction.deferReply();

    const titulo = interaction.options.getString('titulo');
    const descricao = interaction.options.getString('descricao') || 'Sem descrição';
    const dataStr = interaction.options.getString('data');
    const horario = interaction.options.getString('horario');

    // Converte data DD/MM/AAAA HH:MM
    const [dia, mes, ano] = dataStr.split('/');
    const [hora, min] = horario.split(':');
    const dataObj = new Date(ano, mes - 1, dia, hora, min);

    if (isNaN(dataObj.getTime())) {
      return interaction.editReply({ embeds: [criarEmbedErro('Data inválida', 'Use o formato DD/MM/AAAA e HH:MM')] });
    }

    const opId = gerarId();

    await Operacao.create({
      tipo: 'treinamento',
      titulo,
      descricao,
      data: dataObj,
      criadoPor: interaction.user.id,
      participantes: [],
      status: 'agendada',
    });

    const embed = criarEmbedBasica({
      titulo: `🏋️ Treinamento — ${titulo}`,
      descricao: [
        `**Descrição:** ${descricao}`,
        `**Data:** ${formatarData(dataObj)}`,
        `**Criado por:** <@${interaction.user.id}>`,
        '',
        'Confirme sua presença abaixo:',
      ].join('\n'),
      cor: config.cores.primaria,
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`op_checkin_${opId}`)
        .setLabel('Presente')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`op_checkout_${opId}`)
        .setLabel('Ausente')
        .setEmoji('❌')
        .setStyle(ButtonStyle.Danger),
    );

    // Envia no canal de operações
    const canalId = config.canais.operacoes;
    if (canalId && canalId !== 'ID_CANAL_OPERACOES') {
      const canal = await client.channels.fetch(canalId).catch(() => null);
      if (canal) {
        await canal.send({ content: '@everyone', embeds: [embed], components: [row] });
      }
    }

    await interaction.editReply({ embeds: [criarEmbedSucesso('Treinamento agendado', `O treinamento **${titulo}** foi agendado para ${formatarData(dataObj)}.`)] });

    await registrarLog(client, 'operacao_criada', interaction.user.id, '', `Treinamento: ${titulo} — ${formatarData(dataObj)}`);
  },
};
