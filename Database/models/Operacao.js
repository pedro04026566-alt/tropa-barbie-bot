/**
 * Model: Operacao
 * Representa um treinamento, reunião ou operação da facção.
 */

const mongoose = require('mongoose');

const operacaoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['treinamento', 'reuniao', 'operacao'],
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    default: '',
  },
  data: {
    type: Date,
    required: true,
  },
  criadoPor: {
    type: String,
    required: true,
  },
  participantes: [{
    type: String, // Discord IDs
  }],
  observacoes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['agendada', 'em_andamento', 'finalizada', 'cancelada'],
    default: 'agendada',
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Operacao', operacaoSchema);
