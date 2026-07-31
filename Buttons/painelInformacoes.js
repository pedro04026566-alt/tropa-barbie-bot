/**
 * Botão: painel_informacoes
 * Exibe informações gerais da facção.
 */

const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');

module.exports = {
  customId: 'painel_informacoes',
  async execute(interaction, client) {
    const embed = criarEmbedBasica({
      titulo: 'ℹ️ Informações — Tropa da Barbie',
      descricao: [
        `**Facção:** ${config.faccao.nome}`,
        `**Sigla:** ${config.faccao.sigla}`,
        `**Descrição:** ${config.faccao.descricao}`,
        '',
        '**Sobre:**',
        'A Tropa da Barbie é uma facção de FiveM focada em organização,',
        'respeito e diversão. Realizamos operações, treinamentos e',
        'reuniões regularmente para manter o grupo ativo e unido.',
        '',
        '**Como entrar:**',
        'Use o comando `/recrutar` ou o painel de recrutamento.',
      ].join('\n'),
      cor: config.cores.info,
    });
    await interaction.update({ embeds: [embed], components: [] });
  },
};
