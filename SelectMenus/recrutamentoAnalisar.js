/**
 * SelectMenu: recrutamento_analisar
 * Exibe detalhes da candidatura selecionada com botões de aprovar/reprovar.
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');
const { formatarData } = require('../Utils/helpers');
const { Recrutamento } = require('../Database');

module.exports = {
  customId: 'recrutamento_analisar',
  async execute(interaction, client) {
    const aplicacaoId = interaction.values[0];

    const candidatura = await Recrutamento.findById(aplicacaoId);
    if (!candidatura) {
      return interaction.reply({ content: '❌ Candidatura não encontrada.', ephemeral: true });
    }

    if (candidatura.status !== 'pendente') {
      return interaction.reply({ content: `❌ Esta candidatura já foi ${candidatura.status}.`, ephemeral: true });
    }

    const embed = criarEmbedBasica({
      titulo: '📝 Análise de Candidatura',
      descricao: `Candidatura de **${candidatura.nickname}**`,
      cor: config.cores.primaria,
    });

    embed.addFields(
      { name: '👤 Discord', value: `<@${candidatura.discordId}>`, inline: true },
      { name: '🎮 Nickname', value: candidatura.nickname, inline: true },
      { name: '🎂 Idade', value: `${candidatura.idade || 'N/A'}`, inline: true },
      { name: '🆔 Steam ID', value: candidatura.steamId || '—', inline: true },
      { name: '📅 Data', value: formatarData(candidatura.dataAplicacao), inline: true },
      { name: '📊 Status', value: candidatura.status, inline: true },
      { name: '📝 Experiência', value: candidatura.experiencia || '—', inline: false },
      { name: '🌸 Motivo', value: candidatura.motivo || '—', inline: false },
    );

    const candidaturaId = candidatura._id.toString();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`recrutamento_aprovar_${candidaturaId}`)
        .setLabel('Aprovar')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`recrutamento_reprovar_${candidaturaId}`)
        .setLabel('Reprovar')
        .setEmoji('❌')
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.update({ embeds: [embed], components: [row] });
  },
};
