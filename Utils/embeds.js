/**
 * Utilitários de Embed — Cria embeds padronizados com o tema preto e rosa neon.
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../Config/config');

/**
 * Cria uma embed básica personalizada.
 * @param {Object} opcoes - { titulo, descricao, cor, footer, thumbnail }
 * @returns {EmbedBuilder}
 */
function criarEmbedBasica({ titulo = '', descricao = '', cor = null, footer = '', thumbnail = null } = {}) {
  const embed = new EmbedBuilder()
    .setColor(cor || config.cores.primaria)
    .setTimestamp();

  if (titulo) embed.setTitle(titulo);
  if (descricao) embed.setDescription(descricao);
  if (thumbnail) embed.setThumbnail(thumbnail);

  const footerText = footer || `${config.faccao.nome} | ${new Date().toLocaleDateString('pt-BR')}`;
  embed.setFooter({ text: footerText });

  return embed;
}

/**
 * Cria uma embed de sucesso (verde neon).
 */
function criarEmbedSucesso(titulo, descricao) {
  return criarEmbedBasica({
    titulo: `✅ ${titulo}`,
    descricao,
    cor: config.cores.sucesso,
    footer: `${config.faccao.nome} | Sucesso`,
  });
}

/**
 * Cria uma embed de erro (vermelho neon).
 */
function criarEmbedErro(titulo, descricao) {
  return criarEmbedBasica({
    titulo: `❌ ${titulo}`,
    descricao,
    cor: config.cores.erro,
    footer: `${config.faccao.nome} | Erro`,
  });
}

/**
 * Cria uma embed de aviso (dourado).
 */
function criarEmbedAviso(titulo, descricao) {
  return criarEmbedBasica({
    titulo: `⚠️ ${titulo}`,
    descricao,
    cor: config.cores.aviso,
    footer: `${config.faccao.nome} | Aviso`,
  });
}

/**
 * Cria uma embed informativa (ciano neon).
 */
function criarEmbedInfo(titulo, descricao) {
  return criarEmbedBasica({
    titulo: `ℹ️ ${titulo}`,
    descricao,
    cor: config.cores.info,
    footer: `${config.faccao.nome} | Informação`,
  });
}

module.exports = {
  criarEmbedBasica,
  criarEmbedSucesso,
  criarEmbedErro,
  criarEmbedAviso,
  criarEmbedInfo,
};
