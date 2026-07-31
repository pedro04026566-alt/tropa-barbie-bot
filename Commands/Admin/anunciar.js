/**
 * Comando: /anunciar
 * Envia um anúncio personalizado e estilizado no canal de anúncios.
 * Formatação automática com tema rosa neon — divisórias, rodapé elegante,
 * timestamp, thumbnail opcional e tipografia cuidada.
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedErro, criarEmbedSucesso } = require('../../Utils/embeds');
const { temPermissao } = require('../../Utils/helpers');
const { registrarLog } = require('../../Utils/logger');

// ═══════════════════════════════════════════
//  EMOJIS TEMÁTICOS POR TIPO DE ANÚNCIO
// ═══════════════════════════════════════════
const EMOJI_ANUNCIO = '🌸';
const DIVISORIA = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
const DIVISORIA_FINA = '────────────────────────────';
const SETA = '▸';
const BRILHO = '✦';

/**
 * Detecta o tipo de anúncio pelo título e seleciona emoji + cor.
 */
function detectarTipo(titulo) {
  const t = titulo.toLowerCase();
  if (/treino|treinamento/.test(t)) return { emoji: '🏋️', cor: 0x00E5FF };
  if (/reuni[aã]o/.test(t)) return { emoji: '📢', cor: 0xFFD700 };
  if (/opera[cç][aã]o|op/.test(t)) return { emoji: '🎯', cor: 0xFF1744 };
  if (/evento/.test(t)) return { emoji: '🎉', cor: 0xFF69B4 };
  if (/recruta|recrutamento/.test(t)) return { emoji: '📋', cor: 0x39FF14 };
  if (/aviso|alerta|importante/.test(t)) return { emoji: '⚠️', cor: 0xFFD700 };
  if (/regra|norma/.test(t)) return { emoji: '📜', cor: 0x00E5FF };
  if (/promo[cç][aã]o|up|subir/.test(t)) return { emoji: '⬆️', cor: 0x39FF14 };
  if (/expuls|ban|remov/.test(t)) return { emoji: '🚫', cor: 0xFF1744 };
  return { emoji: '📢', cor: 0xFF1493 };
}

/**
 * Formata a descrição do anúncio com layout bonito.
 * - Adiciona divisórias
 * - Quebra parágrafos em blocos visuais
 * - Adiciona setas em listas
 */
function formatarDescricao(descricao) {
  // Divide por quebras de linha duplas (parágrafos)
  const paragrafos = descricao.split(/\n\n+/);

  const blocos = paragrafos.map((paragrafo, i) => {
    const linhas = paragrafo.trim().split('\n');

    // Se a linha começa com -, *, • ou número, formata como lista com seta
    const linhasFormatadas = linhas.map((linha) => {
      const linhaTrim = linha.trim();
      if (/^[-*•]\s/.test(linhaTrim)) {
        return `${SETA} ${linhaTrim.replace(/^[-*•]\s/, '')}`;
      }
      if (/^\d+[.)]\s/.test(linhaTrim)) {
        return `${SETA} ${linhaTrim.replace(/^\d+[.)]\s/, '')}`;
      }
      return linhaTrim;
    });

    return linhasFormatadas.join('\n');
  });

  // Monta a descrição final com divisórias entre seções
  let desc = `\n${BRILHO} **${DIVISORIA}** ${BRILHO}\n\n`;
  desc += blocos.join(`\n\n${DIVISORIA_FINA}\n\n`);
  desc += `\n\n${BRILHO} **${DIVISORIA}** ${BRILHO}\n`;

  return desc;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anunciar')
    .setDescription('Envia um anúncio estilizado no canal de anúncios')
    .addStringOption((opt) => opt.setName('titulo').setDescription('Título do anúncio').setRequired(true))
    .addStringOption((opt) => opt.setName('descricao').setDescription('Descrição do anúncio (suporta quebras de linha)').setRequired(true))
    .addStringOption((opt) => opt.setName('cor').setDescription('Cor em HEX (ex: #FF1493). Deixe vazio para auto').setRequired(false))
    .addStringOption((opt) => opt.setName('imagem').setDescription('URL da imagem do anúncio').setRequired(false))
    .addStringOption((opt) => opt.setName('thumbnail').setDescription('URL de uma imagem pequena (canto superior)').setRequired(false)),
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
    const thumbnailUrl = interaction.options.getString('thumbnail');

    // Detecta tipo e emoji automaticamente
    const { emoji, cor: corAuto } = detectarTipo(titulo);

    // Define a cor: manual > auto > padrão rosa neon
    let cor = corAuto;
    if (corHex) {
      const parsed = parseInt(corHex.replace('#', ''), 16);
      if (!isNaN(parsed)) cor = parsed;
    }

    // Formata a descrição
    const descFormatada = formatarDescricao(descricao);

    // Cria a embed estilizada
    const embed = new EmbedBuilder()
      .setColor(cor)
      .setTimestamp()
      .setTitle(`${emoji}  ${titulo}`)
      .setDescription(descFormatada)
      .setFooter({
        text: `${config.faccao.nome} • Anúncio Oficial`,
        iconURL: config.faccao.logo || undefined,
      });

    // Thumbnail (logo da facção ou personalizada)
    if (thumbnailUrl) {
      embed.setThumbnail(thumbnailUrl);
    } else if (config.faccao.logo) {
      embed.setThumbnail(config.faccao.logo);
    }

    // Imagem do anúncio
    if (imagem) embed.setImage(imagem);

    // Author com quem fez o anúncio
    embed.setAuthor({
      name: `Publicado por ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
    });

    // Envia para o canal de anúncios
    const canalId = config.canais.anuncios;
    if (!canalId) {
      return interaction.editReply({ embeds: [criarEmbedErro('Canal não configurado', 'O canal de anúncios não foi configurado em Config/config.js')] });
    }

    const canal = await client.channels.fetch(canalId).catch(() => null);
    if (!canal) {
      return interaction.editReply({ embeds: [criarEmbedErro('Canal não encontrado', 'Não foi possível encontrar o canal de anúncios')] });
    }

    // Menção do cargo configurado
    const mencao = config.cargos.mencaoAnuncio ? `<@&${config.cargos.mencaoAnuncio}>` : '';

    await canal.send({
      content: mencao || undefined,
      embeds: [embed],
    });

    // Registra log
    await registrarLog(client, 'anuncio', interaction.user.id, '', `Anúncio: ${titulo}`);

    await interaction.editReply({
      embeds: [criarEmbedSucesso('Anúncio enviado!', `O anúncio foi publicado com sucesso no canal ${canal}`)],
    });
  },
};
