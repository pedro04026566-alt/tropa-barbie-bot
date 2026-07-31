/**
 * Evento: interactionCreate
 * Gerencia todas as interações: comandos, botões, modais e select menus.
 */

const config = require('../Config/config');
const { criarEmbedErro } = require('../Utils/embeds');
const { temPermissao } = require('../Utils/helpers');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      // ═══ COMANDOS SLASH ═══
      if (interaction.isChatInputCommand()) {
        const comando = client.commands.get(interaction.commandName);
        if (!comando) return;

        // Verifica permissão se o comando exigir
        if (comando.requireAuth && !temPermissao(interaction.member)) {
          return interaction.reply({
            embeds: [criarEmbedErro('Sem permissão', config.mensagens.semPermissao)],
            ephemeral: true,
          });
        }

        await comando.execute(interaction, client);
        return;
      }

      // ═══ BOTÕES ═══
      if (interaction.isButton()) {
        // Busca por ID exato ou por prefixo (startsWith)
        let botao = client.buttons.get(interaction.customId);

        if (!botao) {
          // Tenta encontrar por prefixo (ex: op_checkin_XXXX)
          for (const [id, handler] of client.buttons) {
            if (handler.customId && interaction.customId.startsWith(handler.customId)) {
              botao = handler;
              break;
            }
          }
        }

        if (!botao) return;
        await botao.execute(interaction, client);
        return;
      }

      // ═══ SELECT MENUS ═══
      if (interaction.isStringSelectMenu()) {
        let menu = client.selectMenus.get(interaction.customId);

        if (!menu) {
          for (const [id, handler] of client.selectMenus) {
            if (handler.customId && interaction.customId.startsWith(handler.customId)) {
              menu = handler;
              break;
            }
          }
        }

        if (!menu) return;
        await menu.execute(interaction, client);
        return;
      }

      // ═══ MODAIS ═══
      if (interaction.isModalSubmit()) {
        let modal = client.modals.get(interaction.customId);

        if (!modal) {
          for (const [id, handler] of client.modals) {
            if (handler.customId && interaction.customId.startsWith(handler.customId)) {
              modal = handler;
              break;
            }
          }
        }

        if (!modal) return;
        await modal.execute(interaction, client);
        return;
      }
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} [Interaction] Erro:`, erro.message);

      const embedErro = criarEmbedErro('Erro', config.mensagens.erroGenerico);

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ embeds: [embedErro], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [embedErro], ephemeral: true }).catch(() => {});
      }
    }
  },
};
