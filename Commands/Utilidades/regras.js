/**
 * Comando: /regras
 * Exibe as regras da facção.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');

// Regras padrão — edite conforme necessário
const regrasFaccao = [
  '**1.** Respeito acima de tudo. Trate todos os membros com educação.',
  '**2.** Proibido uso de cheats, hacks ou mods proibidos.',
  '**3.** Comparecer aos treinamentos e operações quando possível.',
  '**4.** Comunicar ausências com antecedência à liderança.',
  '**5.** Manter o Discord ativo e responder chamados.',
  '**6.** Proibido divulgar outras facções sem autorização.',
  '**7.** Seguir as ordens dos superiores durante operações.',
  '**8.** Presença mínima exigida para permanecer na facção.',
  '**9.** Proibido metagaming ou powergaming.',
  '**10.** Divirta-se e faça amizades! 🌸',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regras')
    .setDescription('Exibe as regras da facção'),
  name: 'regras',
  category: 'Utilidades',
  requireAuth: false,
  async execute(interaction, client) {
    const embed = criarEmbedBasica({
      titulo: '📋 Regras — Tropa da Barbie',
      descricao: regrasFaccao.join('\n\n'),
      cor: config.cores.primaria,
      footer: `${config.faccao.nome} | Regras Oficiais`,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
