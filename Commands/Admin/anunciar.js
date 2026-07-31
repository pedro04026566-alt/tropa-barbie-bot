/**
 * Comando: /anunciar
 * Envia um anúncio personalizado no canal de anúncios.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica, criarEmbedErro, criarEmbedSucesso } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anunciar')
    .setDescription('Envia um anúncio no canal de anúncios')
    .addStringOption((opt) => opt.setName('titulo').setDescription('Título do anúncio').setRequired(true))
    .addStringOption((opt) => opt.setName('descricao').setDescription('Descrição do anúncio').setRequired(true))
    .addStringOption((opt) => opt.setName('cor').setDescription('Cor em HEX (ex: #FF1493)').setRequired(false))
    .addStringOption((opt) => opt.setName('imagem').setDescription('URL da imagem').setRequired(false)),
  name: 'anunciar',
  category: 'Admin',
  requireAuth: true,
  async execute(interaction, client) {
    if (!temPermissao(interaction.member)) {
      return interaction.reply({ content: config.mensagens.semPermissao, ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const titulo = interaction.options.getString('titulo');
    const descricao = interaction.options.getString('descricao');
    const corHex = interaction.options.getString('cor');
    const imagem = interaction.options.getString('imagem');

    // Converte cor hex para número
    let cor = config.cores.primaria;
    if (corHex) {
      try {
        cor = parseInt(corHex.replace('#', ''), 16);
      } catch {
        cor = config.cores.primaria;
      }
    }

    const embed = criarEmbedBasica({
      titulo: `📢 ${titulo}`,
      descricao,
      cor,
      footer: `${config.faccao.nome} | Anúncio Oficial`,
    });

    if (imagem) embed.setImage(imagem);

    // Envia para o canal de anúncios
    const canalId = config.canais.anuncios;
    if (!canalId || canalId === 'ID_CANAL_ANUNCIOS') {
      return interaction.editReply({ embeds: [criarEmbedErro('Canal não configurado', 'O canal de anúncios não foi configurado em Config/config.js')] });
    }

    const canal = await client.channels.fetch(canalId).catch(() => null);
    if (!canal) {
      return interaction.editReply({ embeds: [criarEmbedErro('Canal não encontrado', 'Não foi possível encontrar o canal de anúncios')] });
    }

    await canal.send({ embeds: [embed] });

    // Registra log
    await registrarLog(client, 'anuncio', interaction.user.id, '', `Anúncio: ${titulo}`);

    await interaction.editReply({ embeds: [criarEmbedSucesso('Anúncio enviado', `O anúncio foi enviado com sucesso no canal ${canal}`)] });
  },
};
