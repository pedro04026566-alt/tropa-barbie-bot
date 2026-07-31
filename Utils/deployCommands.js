/**
 * Script para registrar comandos Slash no Discord.
 * Execute com: node Utils/deployCommands.js
 */

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Coleta todos os comandos das subpastas de Commands/
const comandos = [];
const diretorioComandos = path.join(__dirname, '..', 'Commands');

const subpastas = fs.readdirSync(diretorioComandos, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const subpasta of subpastas) {
  const pastaPath = path.join(diretorioComandos, subpasta);
  const arquivos = fs.readdirSync(pastaPath).filter((f) => f.endsWith('.js'));

  for (const arquivo of arquivos) {
    const caminhoArquivo = path.join(pastaPath, arquivo);
    const comando = require(caminhoArquivo);

    if (comando.data && comando.data.name) {
      comandos.push(comando.data.toJSON());
      console.log(`[Deploy] Comando carregado: /${comando.data.name}`);
    }
  }
}

// Registra os comandos no Discord
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`[Deploy] Registrando ${comandos.length} comando(s) no Discord...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: comandos },
    );

    console.log(`[Deploy] ✅ ${data.length} comando(s) registrado(s) com sucesso!`);
  } catch (erro) {
    console.error('[Deploy] ❌ Erro ao registrar comandos:', erro.message);
  }
})();
