/**
 * Comando: /bot-info
 * Exibe informações do bot e status do sistema.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');
const { isConnected } = require('../../Database/connection');
const { Membro, Operacao, Ticket, Economia } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDescription('Exibe informações do bot'),
  name: 'bot-info',
  category: 'Utilidades',
  requireAuth: false,
  async execute(interaction, client) {
    await interaction.deferReply();

    // Conta registros no banco
    const totalMembros = isConnected() ? await Membro.countDocuments({ status: 'ativo' }) : 0;
    const totalOperacoes = isConnected() ? await Operacao.countDocuments() : 0;
    const totalTickets = isConnected() ? await Ticket.countDocuments() : 0;
    const totalEconomia = isConnected() ? await Economia.countDocuments() : 0;

    // Calcula uptime
    const uptime = process.uptime();
    const dias = Math.floor(uptime / 86400);
    const horas = Math.floor((uptime % 86400) / 3600);
    const minutos = Math.floor((uptime % 3600) / 60);

    const embed = criarEmbedBasica({
      titulo: '🤖 Informações do Bot — Tropa da Barbie',
      descricao: `**${config.faccao.nome}** — ${config.faccao.descricao}`,
      cor: config.cores.primaria,
      thumbnail: client.user.displayAvatarURL({ dynamic: true }),
    });

    embed.addFields(
      { name: '📊 Versão', value: '1.0.0', inline: true },
      { name: '⚡ Ping', value: `${client.ws.ping}ms`, inline: true },
      { name: '🟢 MongoDB', value: isConnected() ? 'Conectado' : 'Desconectado', inline: true },
      { name: '🕐 Uptime', value: `${dias}d ${horas}h ${minutos}m`, inline: true },
      { name: '🏰 Servidores', value: `${client.guilds.cache.size}`, inline: true },
      { name: '👥 Membros Ativos', value: `${totalMembros}`, inline: true },
      { name: '🎯 Operações', value: `${totalOperacoes}`, inline: true },
      { name: '🎫 Tickets', value: `${totalTickets}`, inline: true },
      { name: '💰 Transações', value: `${totalEconomia}`, inline: true },
    );

    await interaction.editReply({ embeds: [embed] });
  },
};
