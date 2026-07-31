# 🌸 Tropa da Barbie — Bot Discord para Facção FiveM

Bot profissional para Discord, desenvolvido em **Node.js** com **discord.js v14** e **MongoDB**, projetado para gerenciar facções de FiveM com tema moderno em **preto e rosa neon**.

## ✨ Funcionalidades

- **Sistema de boas-vindas** personalizado
- **Painel principal** com botões interativos (recrutamento, tickets, regras, informações)
- **Sistema de recrutamento** com formulário, aprovação/reprovação e envio automático para canais
- **Sistema de tickets** para suporte, denúncias e recrutamento
- **Gerenciamento de membros** — promover, rebaixar, expulsar e registrar advertências
- **Logs completos** de todas as ações do servidor
- **Sistema de anúncios** com embeds personalizadas
- **Painel administrativo** restrito a cargos autorizados
- **Comandos para treinamentos, reuniões e operações**
- **Sistema de presença** (check-in e check-out)
- **Registro de operações** com data, horário, participantes e observações
- **Sistema de economia interna** — caixa da facção, entradas, saídas e saldo
- **Configuração fácil** por arquivo ou banco de dados
- **Tratamento de erros** para evitar falhas

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- MongoDB (local ou Atlas)
- Um bot no [Discord Developer Portal](https://discord.com/developers/applications)

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd tropa-barbie-bot
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` com seu token do bot, URI do MongoDB, ID do servidor e ID do cliente.

4. **Configure o bot**
   Edite `Config/config.js` e substitua todos os IDs de cargos e canais pelos IDs reais do seu servidor.

5. **Registre os comandos Slash**
   ```bash
   npm run deploy
   ```

6. **Inicie o bot**
   ```bash
   npm start
   ```

## 📁 Estrutura do Projeto

```
tropa-barbie-bot/
├── Commands/              # Comandos Slash
│   ├── Admin/             # /painel, /anunciar, /painel-recrutamento, /painel-tickets
│   ├── Membros/           # /promover, /rebaixar, /expulsar, /advertir, /ver-membro
│   ├── Recrutamento/      # /recrutar, /analisar-recrutamento
│   ├── Tickets/           # /ticket, /fechar-ticket
│   ├── Economia/          # /caixa, /registrar-entrada, /registrar-saida, /extrato
│   ├── Operacoes/         # /treinamento, /reuniao, /operacao, /presenca, /ver-operacoes
│   └── Utilidades/        # /ajuda, /bot-info, /regras
├── Events/                # Eventos do Discord
│   ├── ready.js           # Bot online
│   ├── interactionCreate.js  # Gerencia interações
│   ├── guildMemberAdd.js    # Boas-vindas
│   ├── guildMemberRemove.js # Saída de membros
│   ├── messageDelete.js     # Mensagens apagadas
│   └── guildMemberUpdate.js # Alterações de cargo
├── Buttons/              # Handlers de botões
├── Modals/               # Handlers de modais
├── SelectMenus/          # Handlers de select menus
├── Utils/                # Utilitários
│   ├── embeds.js          # Criador de embeds padronizadas
│   ├── logger.js          # Sistema de logs
│   ├── helpers.js         # Funções auxiliares
│   └── deployCommands.js # Registro de comandos
├── Database/             # Banco de dados
│   ├── connection.js     # Conexão MongoDB
│   ├── index.js          # Exportação de models
│   └── models/           # Schemas Mongoose
├── Config/
│   └── config.js         # Configuração principal
├── index.js              # Arquivo principal
├── package.json
└── .env.example
```

## ⚙️ Configuração

### Arquivo `.env`
```
TOKEN=seu_token_do_bot
MONGODB_URI=mongodb://localhost:27017/tropa_barbie
GUILD_ID=id_do_seu_servidor
CLIENT_ID=id_do_seu_bot
```

### Arquivo `Config/config.js`
Substitua todos os placeholders `ID_CARGO_*` e `ID_CANAL_*` pelos IDs reais do seu servidor Discord.

### Adaptação para outras facções
Para usar o bot com outra facção, basta alterar o arquivo `Config/config.js`:
- `faccao.nome` — Nome da facção
- `faccao.sigla` — Sigla
- `cores` — Cores do tema
- `cargos` — IDs dos cargos
- `canais` — IDs dos canais
- `mensagens` — Textos personalizados

## 📋 Comandos Disponíveis

### Admin
| Comando | Descrição |
|--------|-----------|
| `/painel` | Exibe o painel administrativo principal |
| `/anunciar` | Envia um anúncio no canal de anúncios |
| `/painel-recrutamento` | Exibe o painel de recrutamento |
| `/painel-tickets` | Exibe o painel de tickets |

### Membros
| Comando | Descrição |
|--------|-----------|
| `/promover` | Promove um membro |
| `/rebaixar` | Rebaixa um membro |
| `/expulsar` | Expulsa um membro |
| `/advertir` | Registra uma advertência |
| `/ver-membro` | Exibe informações de um membro |

### Recrutamento
| Comando | Descrição |
|--------|-----------|
| `/recrutar` | Inicia o formulário de recrutamento |
| `/analisar-recrutamento` | Lista candidaturas pendentes |

### Tickets
| Comando | Descrição |
|--------|-----------|
| `/ticket` | Abre o painel de tickets |
| `/fechar-ticket` | Fecha o ticket atual |

### Economia
| Comando | Descrição |
|--------|-----------|
| `/caixa` | Exibe saldo e últimas movimentações |
| `/registrar-entrada` | Registra uma entrada |
| `/registrar-saida` | Registra uma saída |
| `/extrato` | Exibe histórico de transações |

### Operações
| Comando | Descrição |
|--------|-----------|
| `/treinamento` | Agenda um treinamento |
| `/reuniao` | Agenda uma reunião |
| `/operacao` | Agenda uma operação |
| `/presenca` | Check-in/check-out de presença |
| `/ver-operacoes` | Lista operações |

### Utilidades
| Comando | Descrição |
|--------|-----------|
| `/ajuda` | Lista todos os comandos |
| `/bot-info` | Informações do bot |
| `/regras` | Exibe as regras da facção |

## 🛡️ Segurança

- Token do bot armazenado apenas no `.env` (nunca no código)
- Comandos administrativos verificados por cargo
- Tratamento de erros global para evitar crashes
- Permissões de canal em tickets (visível apenas para o usuário e staff)

## 📝 Licença

Este projeto é livre para uso e modificação.
