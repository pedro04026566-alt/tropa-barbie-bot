/**
 * Comando: /analisar-recrutamento
 * Lista candidaturas pendentes para análise da administração.
 */

const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica, criarEmbedErro } = require('../../Utils/embeds');
const { temPermissao, formatarData } = require('../../Utils/helpers');
const { Recrutamento } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('analisar-recrutamento')
    .setDescription('Lista candidaturas de recrutamento pendentes'),
  name: 'analisar-recrutamento',
  category: 'Recrutamento',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    // Busca candidaturas pendentes
    const pendentes = await Recrutamento.find({ status: 'pendente' }).sort({ dataAplicacao: -1 }).limit(25);

    if (pendentes.length === 0) {
      return interaction.editReply({ embeds: [criarEmbedErro('Sem candidaturas', 'Não há candidaturas pendentes no momento.')] });
    }

    const embed = criarEmbedBasica({
      titulo: '📝 Candidaturas Pendentes',
      descricao: `${pendentes.length} candidatura(s) aguardando análise. Selecione uma para revisar:`,
      cor: config.cores.primaria,
    });

    // Cria opções do select menu
    const opcoes = pendentes.map((cand) => ({
      label: `${cand.nickname} (${cand.idade} anos)`,
      description: `Aplicou em ${formatarData(cand.dataAplicacao)}`,
      value: cand._id.toString(),
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('recrutamento_analisar')
        .setPlaceholder('Selecione uma candidatura...')
        .addOptions(opcoes),
    );

    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};
