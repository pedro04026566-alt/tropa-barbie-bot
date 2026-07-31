/**
 * Comando: /promover
 * Promove um membro a um novo cargo na facção.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso, criarEmbedErro } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');
const { Membro } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('promover')
    .setDescription('Promove um membro da facção')
    .addUserOption((opt) => opt.setName('membro').setDescription('Membro a ser promovido').setRequired(true))
    .addStringOption((opt) =>
      opt.setName('cargo_novo')
        .setDescription('Novo cargo')
        .setRequired(true)
        .addChoices(
          { name: 'Membro', value: 'membro' },
          { name: 'Moderador', value: 'moderador' },
          { name: 'Admin', value: 'admin' },
          { name: 'Sublíder', value: 'sublider' },
          { name: 'Líder', value: 'lider' },
        ),
    ),
  name: 'promover',
  category: 'Membros',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    const alvo = interaction.options.getUser('membro');
    const cargoNovo = interaction.options.getString('cargo_novo');

    // Busca ou cria o membro no banco
    let membro = await Membro.findOne({ discordId: alvo.id });
    if (!membro) {
      return interaction.reply({ embeds: [criarEmbedErro('Membro não encontrado', 'Este usuário não está registrado como membro da facção.')], ephemeral: true });
    }

    const cargoAntigo = membro.cargo;
    membro.cargo = cargoNovo;
    await membro.save();

    // Tenta atribuir o cargo no Discord
    const cargoDiscord = config.cargos[cargoNovo];
    if (cargoDiscord && cargoDiscord !== `ID_CARGO_${cargoNovo.toUpperCase()}`) {
      try {
        const membroDiscord = await interaction.guild.members.fetch(alvo.id);
        await membroDiscord.roles.add(cargoDiscord);
        // Remove o cargo antigo se existir
        const cargoAntigoDiscord = config.cargos[cargoAntigo];
        if (cargoAntigoDiscord && cargoAntigoDiscord !== `ID_CARGO_${cargoAntigo.toUpperCase()}`) {
          await membroDiscord.roles.remove(cargoAntigoDiscord);
        }
      } catch (e) {
        // Aviso silencioso se não conseguir gerenciar cargos
        console.warn('Não foi possível atualizar cargos no Discord:', e.message);
      }
    }

    await interaction.reply({
      embeds: [criarEmbedSucesso('Membro promovido', `**${alvo.tag}** foi promovido de **${cargoAntigo}** para **${cargoNovo}**!`)],
    });

    await registrarLog(client, 'membro_promovido', interaction.user.id, alvo.id, `Promovido de ${cargoAntigo} para ${cargoNovo}`);
  },
};
