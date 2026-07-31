/**
 * Comando: /registrar-entrada
 * Registra uma entrada no caixa da facção.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedSucesso, criarEmbedErro } = require('../../Utils/embeds');
const { temPermissao, formatarMoeda } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');
const { Economia, Configuracao } = require('../../Database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registrar-entrada')
    .setDescription('Registra uma entrada no caixa da facção')
    .addNumberOption((opt) => opt.setName('valor').setDescription('Valor da entrada').setRequired(true).setMinValue(0.01))
    .addStringOption((opt) => opt.setName('descricao').setDescription('Descrição da entrada').setRequired(true)),
  name: 'registrar-entrada',
  category: 'Economia',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    await interaction.deferReply();

    const valor = interaction.options.getNumber('valor');
    const descricao = interaction.options.getString('descricao');

    // Busca ou cria configuração
    let configDb = await Configuracao.findOne({ guildId: interaction.guild.id });
    if (!configDb) {
      configDb = await Configuracao.create({ guildId: interaction.guild.id });
    }

    const novoSaldo = (configDb.economiaSaldo || 0) + valor;
    configDb.economiaSaldo = novoSaldo;
    await configDb.save();

    // Registra a transação
    await Economia.create({
      tipo: 'entrada',
      valor,
      descricao,
      registradoPor: interaction.user.id,
      saldoApos: novoSaldo,
    });

    await interaction.editReply({
      embeds: [criarEmbedSucesso('Entrada registrada', `📥 **Valor:** ${formatarMoeda(valor)}\n📝 **Descrição:** ${descricao}\n💰 **Novo saldo:** ${formatarMoeda(novoSaldo)}`)],
    });

    // Envia log no canal de economia
    const canalEconomiaId = config.canais.logsEconomia;
    if (canalEconomiaId && canalEconomiaId !== 'ID_CANAL_LOGS_ECONOMIA') {
      const canal = await client.channels.fetch(canalEconomiaId).catch(() => null);
      if (canal) {
        await canal.send({ embeds: [criarEmbedSucesso('Entrada registrada', `📥 ${formatarMoeda(valor)} — ${descricao}\nSaldo: ${formatarMoeda(novoSaldo)}\nPor: <@${interaction.user.id}>`)] });
      }
    }

    await registrarLog(client, 'economia_movimento', interaction.user.id, '', `Entrada: +${formatarMoeda(valor)} — ${descricao}`);
  },
};
