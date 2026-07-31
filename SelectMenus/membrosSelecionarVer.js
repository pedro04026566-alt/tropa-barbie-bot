/**
 * SelectMenu: membros_selecionar_ver
 * Exibe o perfil completo do membro selecionado.
 */

const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { formatarData } = require('../../Utils/helpers');
const { Membro } = require('../../Database');

const cargosIcon = {
  lider: '👑 Líder', sublider: '⭐ Sublíder', admin: '🔧 Admin',
  moderador: '🛡️ Moderador', membro: '👤 Membro', recruta: '🌸 Recruta',
};
const statusIcon = { ativo: '🟢 Ativo', inativo: '⚪ Inativo', expulso: '🔴 Expulso' };

module.exports = {
  customId: 'membros_selecionar_ver',
  async execute(interaction, client) {
    const discordId = interaction.values[0];

    const membro = await Membro.findOne({ discordId });
    if (!membro) {
      return interaction.reply({ content: '❌ Membro não encontrado.', ephemeral: true });
    }

    const embed = criarEmbedBasica({
      titulo: `👤 Perfil — ${membro.nickname || discordId}`,
      descricao: 'Informações do membro',
      cor: config.cores.primaria,
    });

    embed.addFields(
      { name: '🎮 Nickname', value: membro.nickname || '—', inline: true },
      { name: '🎖️ Cargo', value: cargosIcon[membro.cargo] || membro.cargo, inline: true },
      { name: '📍 Status', value: statusIcon[membro.status] || membro.status, inline: true },
      { name: '📅 Entrada', value: formatarData(membro.dataEntrada), inline: true },
      { name: '⚠️ Advertências', value: `${membro.advertencias.length}/${config.geral.maxAdvertencias}`, inline: true },
      { name: '🕐 Presenças', value: `${membro.presencaTotal}`, inline: true },
    );

    if (membro.advertencias.length > 0) {
      const advs = membro.advertencias.map((a, i) => `**${i + 1}.** ${a.motivo} — *${formatarData(a.data)}*`).join('\n');
      embed.addFields({ name: '📋 Advertências', value: advs.slice(0, 1024), inline: false });
    }

    await interaction.update({ embeds: [embed], components: [] });
  },
};
