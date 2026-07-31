/**
 * Comando: /ver-membro
 * Exibe informações detalhadas de um membro da facção.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica, criarEmbedErro } = require('../../Utils/embeds');
const { formatarData } = require('../../Utils/helpers');
const { Membro } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ver-membro')
    .setDescription('Exibe informações de um membro')
    .addUserOption((opt) => opt.setName('membro').setDescription('Membro para visualizar').setRequired(true)),
  name: 'ver-membro',
  category: 'Membros',
  requireAuth: false,
  async execute(interaction, client) {
    const alvo = interaction.options.getUser('membro');

    let membro = await Membro.findOne({ discordId: alvo.id });
    if (!membro) {
      return interaction.reply({ embeds: [criarEmbedErro('Membro não encontrado', 'Este usuário não está registrado na facção.')], ephemeral: true });
    }

    const cargosIcon = {
      lider: '👑 Líder',
      sublider: '⭐ Sublíder',
      admin: '🔧 Admin',
      moderador: '🛡️ Moderador',
      membro: '👤 Membro',
      recruta: '🌸 Recruta',
    };

    const statusIcon = {
      ativo: '🟢 Ativo',
      inativo: '⚪ Inativo',
      expulso: '🔴 Expulso',
    };

    const embed = criarEmbedBasica({
      titulo: `👤 Perfil — ${alvo.tag}`,
      descricao: `Informações do membro da **${config.faccao.nome}**`,
      cor: config.cores.primaria,
      thumbnail: alvo.displayAvatarURL({ dynamic: true }),
    });

    embed.addFields(
      { name: '🎮 Nickname', value: membro.nickname || 'Não definido', inline: true },
      { name: '🎖️ Cargo', value: cargosIcon[membro.cargo] || membro.cargo, inline: true },
      { name: '📍 Status', value: statusIcon[membro.status] || membro.status, inline: true },
      { name: '📅 Entrada', value: formatarData(membro.dataEntrada), inline: true },
      { name: '⚠️ Advertências', value: `${membro.advertencias.length}/${config.geral.maxAdvertencias}`, inline: true },
      { name: '🕐 Presenças', value: `${membro.presencaTotal} check-ins`, inline: true },
    );

    // Lista advertências se houver
    if (membro.advertencias.length > 0) {
      const advertenciasTexto = membro.advertencias
        .map((adv, i) => `**${i + 1}.** ${adv.motivo} — *${formatarData(adv.data)}*`)
        .join('\n');
      embed.addFields({ name: '📋 Histórico de Advertências', value: advertenciasTexto, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
