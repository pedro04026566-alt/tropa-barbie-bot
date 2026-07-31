/**
 * Modal: ticket_motivo
 * Processa o motivo do ticket e cria o canal privado.
 */

const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../Config/config');
const { criarEmbedBasica, criarEmbedSucesso } = require('../Utils/embeds');
const { registrarLog } = require('../Utils/logger');
const { gerarId } = require('../Utils/helpers');
const { Ticket } = require('../Database');

module.exports = {
  customId: 'ticket_motivo',
  async execute(interaction, client) {
    const motivo = interaction.fields.getTextInputValue('motivo') || 'Sem descrição';

    // Recupera o tipo de ticket armazenado temporariamente
    const tipo = client.ticketTipo.get(interaction.user.id) || 'suporte';
    client.ticketTipo.delete(interaction.user.id);

    const ticketId = gerarId();

    // Determina a categoria do canal
    let categoriaId;
    let nomeTipo;
    switch (tipo) {
      case 'denuncia':
        categoriaId = config.tickets.categoriaDenuncia;
        nomeTipo = 'Denúncia';
        break;
      case 'recrutamento':
        categoriaId = config.tickets.categoriaRecrutamento;
        nomeTipo = 'Recrutamento';
        break;
      default:
        categoriaId = config.tickets.categoriaSuporte;
        nomeTipo = 'Suporte';
    }

    // Cria o canal do ticket
    const canalOptions = {
      name: `ticket-${ticketId.toLowerCase()}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        },
      ],
    };

    // Adiciona a categoria se configurada
    if (categoriaId && !categoriaId.startsWith('ID_CATEGORIA')) {
      canalOptions.parent = categoriaId;
    }

    // Permite que admins/autorizados vejam o ticket
    for (const cargoId of config.cargos.autorizados) {
      if (cargoId && !cargoId.startsWith('ID_')) {
        canalOptions.permissionOverwrites.push({
          id: cargoId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        });
      }
    }

    try {
      const canal = await interaction.guild.channels.create(canalOptions);

      // Salva no banco
      await Ticket.create({
        ticketId,
        channelId: canal.id,
        userId: interaction.user.id,
        tipo,
        status: 'aberto',
        assunto: motivo,
      });

      // Envia embed no canal do ticket
      const embed = criarEmbedBasica({
        titulo: `🎫 Ticket ${ticketId} — ${nomeTipo}`,
        descricao: [
          `**Aberto por:** <@${interaction.user.id}>`,
          `**Tipo:** ${nomeTipo}`,
          `**Motivo:** ${motivo}`,
          '',
          'Um membro da equipe atenderá você em breve.',
          'Use o botão abaixo para fechar o ticket quando resolvido.',
        ].join('\n'),
        cor: config.cores.primaria,
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_fechar')
          .setLabel('Fechar Ticket')
          .setEmoji('🔒')
          .setStyle(ButtonStyle.Danger),
      );

      await canal.send({ embeds: [embed], components: [row] });

      // Confirmação para o usuário
      await interaction.reply({
        embeds: [criarEmbedSucesso('Ticket criado', `Seu ticket foi criado: ${canal}`)],
        ephemeral: true,
      });

      await registrarLog(client, 'ticket_criado', interaction.user.id, '', `Ticket ${ticketId} (${nomeTipo}) criado`);
    } catch (erro) {
      console.error('Erro ao criar canal de ticket:', erro.message);
      await interaction.reply({ content: '❌ Erro ao criar o ticket. Tente novamente.', ephemeral: true });
    }
  },
};
