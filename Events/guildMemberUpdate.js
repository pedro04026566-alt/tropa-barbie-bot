/**
 * Evento: guildMemberUpdate
 * Registra alterações de cargos dos membros.
 */

const config = require('../Config/config');
const { registrarLog } = require('../Utils/logger');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember, client) {
    try {
      // Compara cargos antigos e novos
      const cargosAntigos = oldMember.roles.cache;
      const cargosNovos = newMember.roles.cache;

      const adicionados = cargosNovos.filter((r) => !cargosAntigos.has(r.id));
      const removidos = cargosAntigos.filter((r) => !cargosNovos.has(r.id));

      if (adicionados.size > 0) {
        const nomes = adicionados.map((r) => r.name).join(', ');
        await registrarLog(client, 'cargo_alterado', '', newMember.id, `Cargo(s) adicionado(s): ${nomes} → ${newMember.user.tag}`);
      }

      if (removidos.size > 0) {
        const nomes = removidos.map((r) => r.name).join(', ');
        await registrarLog(client, 'cargo_alterado', '', newMember.id, `Cargo(s) removido(s): ${nomes} → ${newMember.user.tag}`);
      }
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} [guildMemberUpdate] Erro:`, erro.message);
    }
  },
};
