/**
 * Model: Economia
 * Registra movimentações financeiras da facção (entradas e saídas).
 */

const mongoose = require('mongoose');

const economiaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['entrada', 'saida'],
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  registradoPor: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  saldoApos: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Economia', economiaSchema);
