/**
 * Modal: recrutamento_form
 * Processa o formulário de recrutamento submetido pelo usuário.
 */

const config = require('../Config/config');
const { criarEmbedSucesso, criarEmbedBasica } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');
const { formatarData } = require('../Utils/helpers');
const { Recrutamento } = require('../Database');

module.exports = {
  customId: 'recrutamento_form',
  async execute(interaction, client) {
    // Extrai os campos do modal
    const nickname = interaction.fields.getTextInputValue('nickname');
    const idade = parseInt(interaction.fields.getTextInputValue('idade'), 10);
    const experiencia = interaction.fields.getTextInputValue('experiencia');
    const steamId = interaction.fields.getTextInputValue('steamId');
    const motivo = interaction.fields.getTextInputValue('motivo');

    // Salva no banco de dados
    const recrutamento = await Recrutamento.create({
      discordId: interaction.user.id,
      nickname,
      idade: isNaN(idade) ? null : idade,
      experiencia,
      discord: interaction.user.tag,
      steamId,
      horario: '',
      motivo,
      status: 'pendente',
    });

    // Confirmação para o usuário
    await interaction.reply({
      embeds: [criarEmbedSucesso(
        'Candidatura enviada!',
        `Sua candidatura foi registrada com sucesso!\n**ID:** ${recrutamento._id.toString().slice(-8).toUpperCase()}\n\nAguarde a análise da administração. 🌸`,
      )],
      ephemeral: true,
    });

    // Envia notificação no canal de recrutamento
    const canalId = config.canais.recrutamento;
    if (canalId && canalId !== 'ID_CANAL_RECRUTAMENTO') {
      const canal = await client.channels.fetch(canalId).catch(() => null);
      if (canal) {
        const embed = criarEmbedBasica({
          titulo: '📝 Nova Candidatura',
          descricao: `Um novo membro se candidatou à facção!`,
          cor: config.cores.primaria,
        });

        embed.addFields(
          { name: '👤 Candidato', value: `<@${interaction.user.id}>`, inline: true },
          { name: '🎮 Nickname', value: nickname, inline: true },
          { name: '🎂 Idade', value: `${idade || 'N/A'}`, inline: true },
          { name: '🆔 Steam ID', value: steamId, inline: true },
          { name: '📅 Data', value: formatarData(new Date()), inline: true },
          { name: '📊 Status', value: 'Pendente', inline: true },
          { name: '📝 Experiência', value: experiencia.slice(0, 1024), inline: false },
          { name: '🌸 Motivo', value: motivo.slice(0, 1024), inline: false },
        );

        await canal.send({ content: '@here', embeds: [embed] });
      }
    }

    await registrarLog(client, 'recrutamento_decisao', interaction.user.id, '', `Nova candidatura: ${nickname}`);
  },
};
