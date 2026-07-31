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
      // Coleta todos os comandos das subpastas
      const comandos = [];
      const diretorioComandos = path.join(__dirname, '..', 'Commands');
      const subpastas = fs.readdirSync(diretorioComandos, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

      for (const subpasta of subpastas) {
        const pastaPath = path.join(diretorioComandos, subpasta);
        const arquivos = fs.readdirSync(pastaPath).filter((f) => f.endsWith('.js'));
        for (const arquivo of arquivos) {
          try {
            const comando = require(path.join(pastaPath, arquivo));
            if (comando.data && comando.data.name) {
              comandos.push(comando.data.toJSON());
              console.log(`[Deploy] Comando carregado: /${comando.data.name}`);
            }
          } catch (err) {
            console.error(`[Deploy] Erro ao carregar ${arquivo}:`, err.message);
          }
        }
      }

      console.log(`[Deploy] Total de comandos coletados: ${comandos.length}`);

      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

      const guildId = process.env.GUILD_ID;
      const clientId = process.env.CLIENT_ID;

      console.log(`[Deploy] GUILD_ID: ${guildId ? '✅ configurado' : '❌ vazio'}`);
      console.log(`[Deploy] CLIENT_ID: ${clientId ? '✅ configurado' : '❌ vazio'}`);
      console.log(`[Deploy] TOKEN: ${process.env.TOKEN ? '✅ configurado' : '❌ vazio'}`);

      // Tenta registrar como guild commands (instantâneo) se GUILD_ID estiver configurado
      if (guildId && clientId) {
        console.log(`[Deploy] Registrando ${comandos.length} comandos no servidor ${guildId}...`);
        const data = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: comandos },
        );
        console.log(`${config.geral.prefixoLog} ✅ ${data.length} comando(s) Slash registrado(s) no servidor!`);
      } else if (clientId) {
        // Sem GUILD_ID — registra globalmente (demora até 1h para aparecer)
        console.log('[Deploy] GUILD_ID não configurado. Registrando comandos globalmente (pode demorar até 1h)...');
        const data = await rest.put(
          Routes.applicationCommands(clientId),
          { body: comandos },
        );
        console.log(`${config.geral.prefixoLog} ✅ ${data.length} comando(s) registrado(s) globalmente!`);
      } else {
        console.error(`${config.geral.prefixoLog} ❌ CLIENT_ID não configurado! Adicione nas variáveis de ambiente.`);
      }
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} ❌ Erro ao registrar comandos:`, erro.message);
      if (erro.code) console.error('[Deploy] Código do erro:', erro.code);
      if (erro.status) console.error('[Deploy] Status HTTP:', erro.status);
    }

    // Registra log de inicialização
    await registrarLog(client, 'bot_iniciado', '', '', `Bot iniciado — ${client.guilds.cache.size} servidor(es)`);
  },
};
