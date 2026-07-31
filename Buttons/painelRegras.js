/**
 * Botão: painel_regras
 * Exibe as regras da facção.
 */

const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');

const regrasFaccao = [
  '**1.** Respeito acima de tudo.',
  '**2.** Proibido uso de cheats, hacks ou mods proibidos.',
  '**3.** Comparecer aos treinamentos e operações.',
  '**4.** Comunicar ausências com antecedência.',
  '**5.** Manter o Discord ativo.',
  '**6.** Proibido divulgar outras facções sem autorização.',
  '**7.** Seguir ordens dos superiores durante operações.',
  '**8.** Presença mínima exigida.',
  '**9.** Proibido metagaming ou powergaming.',
  '**10.** Divirta-se e faça amizades! 🌸',
];

module.exports = {
  customId: 'painel_regras',
  async execute(interaction, client) {
    const embed = criarEmbedBasica({
      titulo: '📋 Regras — Tropa da Barbie',
      descricao: regrasFaccao.join('\n\n'),
      cor: config.cores.primaria,
    });
    await interaction.update({ embeds: [embed], components: [] });
  },
};
