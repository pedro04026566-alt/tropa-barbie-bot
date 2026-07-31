/**
 * Comando: /registrar-saida
 * Registra uma saída no caixa da facção.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso, criarEmbedErro } = require('../../Utils/embeds');
const { temPermissao, formatarMoeda } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');
const { Economia, Configuracao } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registrar-saida')
    .setDescription('Registra uma saída no caixa da facção')
    .addNumberOption((opt) => opt.setName('valor').setDescription('Valor da saída').setRequired(true).setMinValue(0.01))
    .addStringOption((opt) => opt.setName('descricao').setDescription('Descrição da saída').setRequired(true)),
  name: 'registrar-saida',
  category: 'Economia',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    await interaction.deferReply();

    const valor = interaction.options.getNumber('valor');
    const descricao = interaction.options.getString('descricao');

    let configDb = await Configuracao.findOne({ guildId: interaction.guild.id });
    if (!configDb) {
      configDb = await Configuracao.create({ guildId: interaction.guild.id });
    }

    // Verifica se há saldo suficiente
    if ((configDb.economiaSaldo || 0) < valor) {
      return interaction.editReply({ embeds: [criarEmbedErro('Saldo insuficiente', `O saldo atual (${formatarMoeda(configDb.economiaSaldo || 0)}) não cobre esta saída.`)] });
    }

    const novoSaldo = (configDb.economiaSaldo || 0) - valor;
    configDb.economiaSaldo = novoSaldo;
    await configDb.save();

    await Economia.create({
      tipo: 'saida',
      valor,
      descricao,
      registradoPor: interaction.user.id,
      saldoApos: novoSaldo,
    });

    await interaction.editReply({
      embeds: [criarEmbedSucesso('Saída registrada', `📤 **Valor:** ${formatarMoeda(valor)}\n📝 **Descrição:** ${descricao}\n💰 **Novo saldo:** ${formatarMoeda(novoSaldo)}`)],
    });

    // Log no canal de economia
    const canalEconomiaId = config.canais.logsEconomia;
    if (canalEconomiaId && canalEconomiaId !== 'ID_CANAL_LOGS_ECONOMIA') {
      const canal = await client.channels.fetch(canalEconomiaId).catch(() => null);
      if (canal) {
        await canal.send({ embeds: [criarEmbedErro('Saída registrada', `📤 ${formatarMoeda(valor)} — ${descricao}\nSaldo: ${formatarMoeda(novoSaldo)}\nPor: <@${interaction.user.id}>`)] });
      }
    }

    await registrarLog(client, 'economia_movimento', interaction.user.id, '', `Saída: -${formatarMoeda(valor)} — ${descricao}`);
  },
};
