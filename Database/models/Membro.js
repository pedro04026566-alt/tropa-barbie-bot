/**
 * Model: Membro
 * Representa um membro da facção no banco de dados.
 */

const mongoose = require('mongoose');

const membroSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  nickname: {
    type: String,
    default: '',
  },
  cargo: {
    type: String,
    enum: ['recruta', 'membro', 'moderador', 'admin', 'sublider', 'lider'],
    default: 'recruta',
  },
  advertencias: [{
    motivo: { type: String, default: '' },
    advertidoPor: { type: String, default: '' },
    data: { type: Date, default: Date.now },
  }],
  dataEntrada: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'expulso'],
    default: 'ativo',
  },
  checkIn: {
    type: Date,
    default: null,
  },
  checkOut: {
    type: Date,
    default: null,
  },
  presencaTotal: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Membro', membroSchema);
