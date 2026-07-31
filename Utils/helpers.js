/**
 * Funções utilitárias gerais do bot.
 */

const config = require('../Config/config');
const { Membro } = require('../Database');

/**
 * Verifica se um membro tem permissão administrativa.
 * Checa por ID de usuário direto (usuariosAdmin) e por cargo (autorizados).
 * @param {GuildMember} member - Membro do Discord
 * @returns {boolean}
 */
function temPermissao(member) {
  if (!member) return false;

  // Verifica por ID de usuário (admins diretos do config)
  if (config.cargos.usuariosAdmin && config.cargos.usuariosAdmin.includes(member.id)) {
    return true;
  }

  // Verifica por IDs de usuário via variável de ambiente (ADMIN_USER_IDS separado por vírgula)
  const envAdmins = process.env.ADMIN_USER_IDS;
  if (envAdmins && envAdmins.split(',').map((id) => id.trim()).includes(member.id)) {
    return true;
  }

  // Verifica por cargo
  return config.cargos.autorizados.some((roleId) =>
    member.roles.cache.has(roleId),
  );
}

/**
 * Formata uma data para o padrão brasileiro.
 * @param {Date} data
 * @returns {string}
 */
function formatarData(data) {
  if (!data) return '—';
  return new Date(data).toLocaleString('pt-BR', {
    timeZone: config.geral.timezone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formata um número como moeda brasileira (R$).
 * @param {number} valor
 * @returns {string}
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0);
}

/**
 * Gera um ID aleatório para tickets e operações.
 * @returns {string}
 */
function gerarId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Busca um membro no banco de dados pelo Discord ID.
 * @param {string} discordId
 * @returns {Promise<Object|null>}
 */
async function buscarMembro(discordId) {
  try {
    return await Membro.findOne({ discordId });
  } catch (erro) {
    console.error(`${config.geral.prefixoLog} [Helpers] Erro ao buscar membro:`, erro.message);
    return null;
  }
}

/**
 * Calcula o tempo entre check-in e check-out formatado.
 * @param {Date} checkIn
 * @returns {string}
 */
function calcularTempoOnline(checkIn) {
  if (!checkIn) return '—';
  const diff = Date.now() - new Date(checkIn).getTime();
  const horas = Math.floor(diff / 3600000);
  const minutos = Math.floor((diff % 3600000) / 60000);
  const segundos = Math.floor((diff % 60000000) / 1000);

  if (horas > 0) return `${horas}h ${minutos}m ${segundos}s`;
  if (minutos > 0) return `${minutos}m ${segundos}s`;
  return `${segundos}s`;
}

module.exports = {
  temPermissao,
  formatarData,
  formatarMoeda,
  gerarId,
  buscarMembro,
  calcularTempoOnline,
};
