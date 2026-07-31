/**
 * TROPA DA BARBIE BOT — Arquivo principal
 * Bot profissional para facção de FiveM
 *
 * Desenvolvido em Node.js + discord.js v14 + MongoDB
 */

require('dotenv').config();

const { Client, GatewayIntentBits, Partials, ActivityType, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./Config/config');
const { conectarBanco } = require('./Database/connection');

// Criação do client com intents necessárias
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
  ],
});

// ═══════════════════════════════════════════
//  COLEÇÕES PARA HANDLERS
// ═══════════════════════════════════════════
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();

// Mapas temporários para dados de interação
client.ticketTipo = new Map(); // userId → tipo de ticket
client.ticketAssunto = new Map(); // userId → assunto

// ═══════════════════════════════════════════
//  CARREGAR COMANDOS SLASH
// ═══════════════════════════════════════════
const diretorioComandos = path.join(__dirname, 'Commands');
const subpastasCmd = fs.readdirSync(diretorioComandos, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const subpasta of subpastasCmd) {
  const pastaPath = path.join(diretorioComandos, subpasta);
  const arquivos = fs.readdirSync(pastaPath).filter((f) => f.endsWith('.js'));

  for (const arquivo of arquivos) {
    const caminho = path.join(pastaPath, arquivo);
    const comando = require(caminho);

    if (comando.data && comando.data.name) {
      client.commands.set(comando.data.name, comando);
      console.log(`[Comando] Carregado: /${comando.data.name} (${subpasta})`);
    }
  }
}

// ═══════════════════════════════════════════
//  CARREGAR EVENTOS
// ═══════════════════════════════════════════
const diretorioEventos = path.join(__dirname, 'Events');
const arquivosEventos = fs.readdirSync(diretorioEventos).filter((f) => f.endsWith('.js'));

for (const arquivo of arquivosEventos) {
  const caminho = path.join(diretorioEventos, arquivo);
  const evento = require(caminho);

  if (evento.name) {
    if (evento.once) {
      client.once(evento.name, (...args) => evento.execute(...args, client));
    } else {
      client.on(evento.name, (...args) => evento.execute(...args, client));
    }
    console.log(`[Evento] Carregado: ${evento.name}`);
  }
}

// ═══════════════════════════════════════════
//  CARREGAR BOTÕES
// ═══════════════════════════════════════════
const diretorioBotoes = path.join(__dirname, 'Buttons');
if (fs.existsSync(diretorioBotoes)) {
  const arquivosBotoes = fs.readdirSync(diretorioBotoes).filter((f) => f.endsWith('.js'));

  for (const arquivo of arquivosBotoes) {
    const botao = require(path.join(diretorioBotoes, arquivo));
    if (botao.customId) {
      client.buttons.set(botao.customId, botao);
      console.log(`[Botão] Carregado: ${botao.customId}`);
    }
  }
}

// ═══════════════════════════════════════════
//  CARREGAR MODAIS
// ═══════════════════════════════════════════
const diretorioModais = path.join(__dirname, 'Modals');
if (fs.existsSync(diretorioModais)) {
  const arquivosModais = fs.readdirSync(diretorioModais).filter((f) => f.endsWith('.js'));

  for (const arquivo of arquivosModais) {
    const modal = require(path.join(diretorioModais, arquivo));
    if (modal.customId) {
      client.modals.set(modal.customId, modal);
      console.log(`[Modal] Carregado: ${modal.customId}`);
    }
  }
}

// ═══════════════════════════════════════════
//  CARREGAR SELECT MENUS
// ═══════════════════════════════════════════
const diretorioSelectMenus = path.join(__dirname, 'SelectMenus');
if (fs.existsSync(diretorioSelectMenus)) {
  const arquivosSelect = fs.readdirSync(diretorioSelectMenus).filter((f) => f.endsWith('.js'));

  for (const arquivo of arquivosSelect) {
    const menu = require(path.join(diretorioSelectMenus, arquivo));
    if (menu.customId) {
      client.selectMenus.set(menu.customId, menu);
      console.log(`[SelectMenu] Carregado: ${menu.customId}`);
    }
  }
}

// ═══════════════════════════════════════════
//  TRATAMENTO DE ERROS GLOBAIS
// ═══════════════════════════════════════════
process.on('unhandledRejection', (erro) => {
  console.error(`${config.geral.prefixoLog} [Erro] Rejeição não tratada:`, erro);
});

process.on('uncaughtException', (erro) => {
  console.error(`${config.geral.prefixoLog} [Erro] Exceção não capturada:`, erro);
});

// ═══════════════════════════════════════════
//  INICIALIZAÇÃO
// ═══════════════════════════════════════════
(async () => {
  try {
    // Conecta ao MongoDB
    await conectarBanco();

    // Login no Discord
    await client.login(process.env.TOKEN);
  } catch (erro) {
    console.error(`${config.geral.prefixoLog} [Erro] Falha ao iniciar o bot:`, erro.message);
    process.exit(1);
  }
})();

module.exports = client;
