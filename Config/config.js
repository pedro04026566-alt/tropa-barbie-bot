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
    lider: '1256724723841368086',
    sublider: '',
    admin: '',
    moderador: '',
    membro: '',
    recruta: '',
    // Cargos autorizados a usar o painel administrativo
    autorizados: ['1256724723841368086'],
    // Cargo mencionado em anu00fancios
    mencaoAnuncio: '1256724723824332962',
    // IDs de usu00e1rios com acesso administrativo total (independente de cargo)
    usuariosAdmin: ['827872889113149461'],
  },

  // ═══════════════════════════════════════════
  //  IDS DE CANAIS (Substitua pelos IDs reais)
  // ═══════════════════════════════════════════
  canais: {
    boasVindas: '1256724724113870895',
    regras: '1256724724386369653',
    anuncios: '1256724724386369652',
    logs: '1256724723841368092',
    logsMembros: '1256724724113870889',
    logsEconomia: '1256724724113870889',
    recrutamento: '1256724724113870890',
    aprovados: '1256724724113870888',
    reprovados: '1532849365121634334',
    tickets: '1256724724386369657',
    operacoes: '1532849909483573362',
    presenca: '1532851156227981462',
  },

  // ═══════════════════════════════════════════
  //  CATEGORIAS DE TICKET
  // ═══════════════════════════════════════════
  tickets: {
    categoriaSuporte: '1532850432102240376',
    categoriaDenuncia: '1532850492605071450',
    categoriaRecrutamento: '1532850553946636439',
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
