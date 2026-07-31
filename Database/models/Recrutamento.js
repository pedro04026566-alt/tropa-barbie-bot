/**
 * Model: Recrutamento
 * Representa uma candidatura de recrutamento à facção.
 */

const mongoose = require('mongoose');

const recrutamentoSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  idade: {
    type: Number,
    default: null,
  },
  experiencia: {
    type: String,
    default: '',
  },
  discord: {
    type: String,
    default: '',
  },
  steamId: {
    type: String,
    default: '',
  },
  horario: {
    type: String,
    default: '',
  },
  motivo: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'reprovado'],
    default: 'pendente',
  },
  decididoPor: {
    type: String,
    default: '',
  },
  dataDecisao: {
    type: Date,
    default: null,
  },
  dataAplicacao: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recrutamento', recrutamentoSchema);
