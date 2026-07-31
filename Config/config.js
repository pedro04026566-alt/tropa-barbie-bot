/**
 * Configuração principal do bot.
 * Altere este arquivo para adaptar o bot a qualquer facção de FiveM.
 * Todas as cores, nomes, IDs de canais e cargos são configuráveis aqui.
 */

module.exports = {
  // ═══════════════════════════════════════════
  //  IDENTIDADE DA FACÇÃO
  // ═══════════════════════════════════════════
  faccao: {
    nome: 'Tropa da Barbie',
    sigla: 'TDB',
    logo: '', // URL do logo (opcional)
    descricao: 'Facção de FiveM — Tropa da Barbie',
  },

  // ═══════════════════════════════════════════
  //  CORES DO TEMA (Preto e Rosa Neon)
  // ═══════════════════════════════════════════
  cores: {
    primaria: 0xFF1493,   // Rosa neon
    secundaria: 0xFF69B4,  // Rosa hot
    sucesso: 0x39FF14,     // Verde neon
    erro: 0xFF1744,        // Vermelho neon
    aviso: 0xFFD700,       // Dourado
    info: 0x00E5FF,        // Ciano neon
    escura: 0x1A1A1A,      // Quase preto
  },

  // ═══════════════════════════════════════════
  //  IDS DE CARGOS (Substitua pelos IDs reais)
  // ═══════════════════════════════════════════
  cargos: {
    lider: 'ID_CARGO_LIDER',
    sublider: 'ID_CARGO_SUBLIDER',
    admin: 'ID_CARGO_ADMIN',
    moderador: 'ID_CARGO_MODERADOR',
    membro: 'ID_CARGO_MEMBRO',
    recruta: 'ID_CARGO_RECRUTA',
    // Cargos autorizados a usar o painel administrativo
    autorizados: ['ID_CARGO_LIDER', 'ID_CARGO_SUBLIDER', 'ID_CARGO_ADMIN'],
    // IDs de usu00e1rios com acesso administrativo total (independente de cargo)
    usuariosAdmin: ['827872889113149461'],
  },

  // ═══════════════════════════════════════════
  //  IDS DE CANAIS (Substitua pelos IDs reais)
  // ═══════════════════════════════════════════
  canais: {
    boasVindas: 'ID_CANAL_BOAS_VINDAS',
    regras: 'ID_CANAL_REGRAS',
    anuncios: 'ID_CANAL_ANUNCIOS',
    logs: 'ID_CANAL_LOGS',
    logsMembros: 'ID_CANAL_LOGS_MEMBROS',
    logsEconomia: 'ID_CANAL_LOGS_ECONOMIA',
    recrutamento: 'ID_CANAL_RECRUTAMENTO',
    aprovados: 'ID_CANAL_APROVADOS',
    reprovados: 'ID_CANAL_REPROVADOS',
    tickets: 'ID_CANAL_TICKETS',
    operacoes: 'ID_CANAL_OPERACOES',
    presenca: 'ID_CANAL_PRESENCA',
  },

  // ═══════════════════════════════════════════
  //  CATEGORIAS DE TICKET
  // ═══════════════════════════════════════════
  tickets: {
    categoriaSuporte: 'ID_CATEGORIA_SUPORTE',
    categoriaDenuncia: 'ID_CATEGORIA_DENUNCIA',
    categoriaRecrutamento: 'ID_CATEGORIA_RECRUTAMENTO',
  },

  // ═══════════════════════════════════════════
  //  CONFIGURAÇÕES GERAIS
  // ═══════════════════════════════════════════
  geral: {
    prefixoLog: '[TropaDaBarbie]',
    timezone: 'America/Sao_Paulo',
    maxAdvertencias: 3, // Expulsa ao atingir
    autoDeleteErro: true, // Apaga mensagens de erro automaticamente
  },

  // ═══════════════════════════════════════════
  //  MENSAGENS PADRÃO
  // ═══════════════════════════════════════════
  mensagens: {
    boasVindas: 'Bem-vindo(a) ao servidor da **{faccao}**, {usuario}! 🌸\n\nLeia as regras em {canalRegras} e divirta-se!',
    semPermissao: '❌ Você não tem permissão para usar este comando.',
    erroGenerico: '❌ Ocorreu um erro ao executar este comando. Tente novamente.',
  },
};
