/**
 * Model: Ticket
 * Representa um ticket de suporte, denúncia ou recrutamento.
 */

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['suporte', 'denuncia', 'recrutamento'],
    required: true,
  },
  status: {
    type: String,
    enum: ['aberto', 'fechado'],
    default: 'aberto',
  },
  assunto: {
    type: String,
    default: '',
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
  dataFechamento: {
    type: Date,
    default: null,
  },
  fechadoPor: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Ticket', ticketSchema);
