/**
 * Modal: anuncio_custom
 * Processa um anúncio personalizado via modal.
 */

const config = require('../Config/config');
const { criarEmbedBasica, criarEmbedSucesso } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');

module.exports = {
  customId: 'anuncio_custom',
  async execute(interaction, client) {
    const titulo = interaction.fields.getTextInputValue('titulo');
    const descricao = interaction.fields.getTextInputValue('descricao');

    const embed = criarEmbedBasica({
      titulo: `📢 ${titulo}`,
      descricao,
      cor: config.cores.primaria,
      footer: `${config.faccao.nome} | Anúncio`,
    });

    const canalId = config.canais.anuncios;
    if (canalId && canalId !== 'ID_CANAL_ANUNCIOS') {
      const canal = await client.channels.fetch(canalId).catch(() => null);
      if (canal) {
        await canal.send({ embeds: [embed] });
      }
    }

    await interaction.reply({
      embeds: [criarEmbedSucesso('Anúncio enviado', 'Seu anúncio foi publicado com sucesso!')],
      ephemeral: true,
    });

    await registrarLog(client, 'anuncio', interaction.user.id, '', `Anúncio via modal: ${titulo}`);
  },
};
