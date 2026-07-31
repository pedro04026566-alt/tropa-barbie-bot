/**
 * Comando: /rebaixar
 * Rebaixa um membro para um cargo inferior.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso, criarEmbedErro } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');
const { Membro } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rebaixar')
    .setDescription('Rebaixa um membro da facção')
    .addUserOption((opt) => opt.setName('membro').setDescription('Membro a ser rebaixado').setRequired(true))
    .addStringOption((opt) =>
      opt.setName('cargo_novo')
        .setDescription('Novo cargo')
        .setRequired(true)
        .addChoices(
          { name: 'Recruta', value: 'recruta' },
          { name: 'Membro', value: 'membro' },
          { name: 'Moderador', value: 'moderador' },
        ),
    ),
  name: 'rebaixar',
  category: 'Membros',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    const alvo = interaction.options.getUser('membro');
    const cargoNovo = interaction.options.getString('cargo_novo');

    let membro = await Membro.findOne({ discordId: alvo.id });
    if (!membro) {
      return interaction.reply({ embeds: [criarEmbedErro('Membro não encontrado', 'Este usuário não está registrado como membro da facção.')], ephemeral: true });
    }

    const cargoAntigo = membro.cargo;
    membro.cargo = cargoNovo;
    await membro.save();

    // Atualiza cargos no Discord
    const cargoDiscord = config.cargos[cargoNovo];
    if (cargoDiscord && cargoDiscord !== `ID_CARGO_${cargoNovo.toUpperCase()}`) {
      try {
        const membroDiscord = await interaction.guild.members.fetch(alvo.id);
        await membroDiscord.roles.add(cargoDiscord);
        const cargoAntigoDiscord = config.cargos[cargoAntigo];
        if (cargoAntigoDiscord && cargoAntigoDiscord !== `ID_CARGO_${cargoAntigo.toUpperCase()}`) {
          await membroDiscord.roles.remove(cargoAntigoDiscord);
        }
      } catch (e) {
        console.warn('Não foi possível atualizar cargos:', e.message);
      }
    }

    await interaction.reply({
      embeds: [criarEmbedSucesso('Membro rebaixado', `**${alvo.tag}** foi rebaixado de **${cargoAntigo}** para **${cargoNovo}**.`)],
    });

    await registrarLog(client, 'membro_rebaixado', interaction.user.id, alvo.id, `Rebaixado de ${cargoAntigo} para ${cargoNovo}`);
  },
};
