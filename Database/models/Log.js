/**
 * Model: Log
 * Registra todas as ações administrativas do servidor.
 */

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: '',
  },
  alvoId: {
    type: String,
    default: '',
  },
  detalhes: {
    type: String,
    default: '',
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Log', logSchema);
