/**
 * Evento: guildMemberAdd
 * Sistema de boas-vindas personalizado.
 */

const config = require('../Config/config');
const { criarEmbedBasica } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    try {
      const canalId = config.canais.boasVindas;
      if (!canalId || canalId === 'ID_CANAL_BOAS_VINDAS') return;

      const canal = await client.channels.fetch(canalId).catch(() => null);
      if (!canal) return;

      // Substitui variáveis na mensagem de boas-vindas
      const mensagem = config.mensagens.boasVindas
        .replace('{faccao}', config.faccao.nome)
        .replace('{usuario}', `<@${member.id}>`)
        .replace('{canalRegras}', `<#${config.canais.regras}>`);

      const embed = criarEmbedBasica({
        titulo: `🌸 Bem-vindo(a) à ${config.faccao.nome}!`,
        descricao: mensagem,
        cor: config.cores.primaria,
        thumbnail: member.user.displayAvatarURL({ dynamic: true }),
        footer: `${config.faccao.nome} | Boas-vindas`,
      });

      await canal.send({ content: `<@${member.id}>`, embeds: [embed] });

      // Registra log
      await registrarLog(client, 'membro_entrou', '', member.id, `${member.user.tag} entrou no servidor`);
    } catch (erro) {
      console.error(`${config.geral.prefixoLog} [guildMemberAdd] Erro:`, erro.message);
    }
  },
};
