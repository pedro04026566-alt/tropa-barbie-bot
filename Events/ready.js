/**
 * Evento: ClientReady
 * Disparado quando o bot está online e pronto para uso.
 * Também registra os comandos Slash automaticamente.
 */

const { ActivityType, Events, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../Config/config');
const { registrarLog } = require('../Utils/logger');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`${config.geral.prefixoLog} 🤖 Bot online como ${client.user.tag}`);
    console.log(`${config.geral.prefixoLog} 📊 Servindo ${client.guilds.cache.size} servidor(es)`);

    // Define presença/status do bot
    client.user.setPresence({
      status: 'online',
      activities: [{
        name: 'Tropa da Barbie 🌸',
        type: ActivityType.Watching,
      }],
    });

    // ═══════════════════════════════════════════
    //  REGISTRO AUTOMÁTICO DE COMANDOS SLASH
    // ═══════════════════════════════════════════
    try {
      const comandos = [];
      const diretorioComandos = path.join(__dirname, '..', 'Commands');
      const subpastas = fs.readdirSync(diretorioComandos, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

      for (const subpasta of subpastas) {
        const pastaPath = path.join(diretorioComandos, subpasta);
        const arquivos = fs.readdirSync(pastaPath).filter((f) => f.endsWith('.js'));
        for (const arquivo of arquivos) {
          const comando = require(path.join(pastaPath, arquivo));
          if (comando.data && comando.data.name) {
            comandos.push(comando.data.toJSON());
          }
        }
      }

      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

      // Registra comandos no servidor (guild) específico — atualização instantânea
      if (process.env.GUILD_ID && process.env.CLIENT_ID) {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
          { body: comandos },
        );
        console.log(`${config.geral.prefixoLog} ✅ ${comandos.length} comando(s) Slash registrado(s) no servidor!`);
      } else {
        console.warn(`${config.geral.prefixoLog} ⚠️ GUILD_ID ou CLIENT_ID não configurados — comandos não registrados.`);
        console.warn(`${config.geral.prefixoLog} ⚠️ Adicione GUILD_ID e CLIENT_ID nas variáveis de ambiente.`);
      }
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} ❌ Erro ao registrar comandos:`, erro.message);
    }

    // Registra log de inicialização
    await registrarLog(client, 'bot_iniciado', '', '', `Bot iniciado — ${client.guilds.cache.size} servidor(es)`);
  },
};
