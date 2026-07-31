/**
 * Exportação centralizada de todos os models do banco de dados.
 */

module.exports = {
  Membro: require('./models/Membro'),
  Ticket: require('./models/Ticket'),
  Recrutamento: require('./models/Recrutamento'),
  Operacao: require('./models/Operacao'),
  Economia: require('./models/Economia'),
  Log: require('./models/Log'),
  Configuracao: require('./models/Configuracao'),
};
