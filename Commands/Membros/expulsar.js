/**
 * Comando: /expulsar
 * Expulsa um membro da facção com motivo.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso, criarEmbedErro } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');
const { Membro } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('expulsar')
    .setDescription('Expulsa um membro da facção')
    .addUserOption((opt) => opt.setName('membro').setDescription('Membro a ser expulso').setRequired(true))
    .addStringOption((opt) => opt.setName('motivo').setDescription('Motivo da expulsão').setRequired(true)),
  name: 'expulsar',
  category: 'Membros',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    const alvo = interaction.options.getUser('membro');
    const motivo = interaction.options.getString('motivo');

    let membro = await Membro.findOne({ discordId: alvo.id });
    if (!membro) {
      return interaction.reply({ embeds: [criarEmbedErro('Membro não encontrado', 'Este usuário não está registrado como membro da facção.')], ephemeral: true });
    }

    membro.status = 'expulso';
    await membro.save();

    // Remove cargos da facção no Discord
    try {
      const membroDiscord = await interaction.guild.members.fetch(alvo.id);
      const cargosParaRemover = Object.values(config.cargos).flat().filter((id) => id !== 'ID_CARGO_LIDER' && typeof id === 'string' && id.startsWith('ID_') === false);
      for (const cargoId of [config.cargos.membro, config.cargos.recruta, config.cargos.moderador, config.cargos.admin, config.cargos.sublider]) {
        if (cargoId && !cargoId.startsWith('ID_')) {
          await membroDiscord.roles.remove(cargoId).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Não foi possível remover cargos:', e.message);
    }

    await interaction.reply({
      embeds: [criarEmbedSucesso('Membro expulso', `**${alvo.tag}** foi expulso da facção.\n**Motivo:** ${motivo}`)],
    });

    await registrarLog(client, 'membro_expulso', interaction.user.id, alvo.id, `Expulso. Motivo: ${motivo}`);
  },
};
