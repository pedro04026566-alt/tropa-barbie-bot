/**
 * Comando: /ajuda
 * Exibe a lista de comandos disponíveis, agrupados por categoria.
 */

const { SlashCommandBuilder } = require('discord.js');
const config = require('../../Config/config');
const { criarEmbedBasica } = require('../../Utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Exibe todos os comandos disponíveis')
    .addStringOption((opt) => opt.setName('comando').setDescription('Ver detalhes de um comando específico').setRequired(false)),
  name: 'ajuda',
  category: 'Utilidades',
  requireAuth: false,
  async execute(interaction, client) {
    const comandoNome = interaction.options.getString('comando');

    if (comandoNome) {
      // Busca o comando específico
      const comando = client.commands.get(comandoNome);
      if (!comando) {
        return interaction.reply({ content: `❌ Comando \`/${comandoNome}\` não encontrado.`, ephemeral: true });
      }

      const embed = criarEmbedBasica({
        titulo: `/${comando.data.name}`,
        descricao: comando.data.description,
        cor: config.cores.primaria,
      });
      embed.addFields(
        { name: '📂 Categoria', value: comando.category || '—', inline: true },
        { name: '🔒 Permissão', value: comando.requireAuth ? 'Apenas autorizados' : 'Público', inline: true },
      );

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Lista todos os comandos agrupados por categoria
    const categorias = {};
    for (const [nome, cmd] of client.commands) {
      const cat = cmd.category || 'Outros';
      if (!categorias[cat]) categorias[cat] = [];
      categorias[cat].push(nome);
    }

    const embed = criarEmbedBasica({
      titulo: '🌸 Ajuda — Tropa da Barbie',
      descricao: 'Lista de todos os comandos disponíveis:',
      cor: config.cores.primaria,
    });

    const iconesCategorias = {
      Admin: '⚙️',
      Membros: '👥',
      Recrutamento: '📝',
      Tickets: '🎫',
      Economia: '💰',
      Operacoes: '🎯',
      Utilidades: '🛠️',
    };

    for (const [cat, cmds] of Object.entries(categorias)) {
      const icone = iconesCategorias[cat] || '📋';
      embed.addFields({
        name: `${icone} ${cat}`,
        value: cmds.map((c) => `\`/${c}\``).join(' • '),
        inline: false,
      });
    }

    embed.addFields({ name: '💡 Dica', value: 'Use `/ajuda <comando>` para ver detalhes de um comando específico.', inline: false });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
