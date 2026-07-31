/**
 * Botão: painel_anuncios
 * Exibe informações sobre o sistema de anúncios.
 */

const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');

module.exports = {
  customId: 'painel_anuncios',
  async execute(interaction, client) {
    const embed = criarEmbedBasica({
      titulo: '📢 Sistema de Anúncios',
      descricao: [
        'Para enviar um anúncio oficial, use o comando:',
        '`/anunciar` com os parâmetros:',
        '',
        '• **titulo** — Título do anúncio',
        '• **descricao** — Conteúdo do anúncio',
        '• **cor** — Cor em HEX (opcional, ex: #FF1493)',
        '• **imagem** — URL de imagem (opcional)',
        '',
        'O anúncio será enviado no canal de anúncios configurado.',
      ].join('\n'),
      cor: config.cores.primaria,
    });
    await interaction.update({ embeds: [embed], components: [] });
  },
};
