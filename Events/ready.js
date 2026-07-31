/**
 * Evento: ready
 * Disparado quando o bot está online e pronto para uso.
 */

const { ActivityType, Events } = require('discord.js');
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

    // Registra log de inicialização
    await registrarLog(client, 'bot_iniciado', '', '', `Bot iniciado — ${client.guilds.cache.size} servidor(es)`);
  },
};
