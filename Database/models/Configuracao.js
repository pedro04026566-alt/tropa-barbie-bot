/**
 * Model: Configuracao
 * Armazena configurações específicas do servidor no banco de dados.
 */

const mongoose = require('mongoose');

const configuracaoSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  canais: {
    type: Object,
    default: {},
  },
  cargos: {
    type: Object,
    default: {},
  },
  mensagens: {
    type: Object,
    default: {},
  },
  economiaSaldo: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Configuracao', configuracaoSchema);
