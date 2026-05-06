# Jira Backlog - Sistema Barber SaaS

## Objetivo
Organizar funcionalidades do Painel do Barbeiro e Portal do Cliente em estrutura pronta para Jira.

## Convencao de nomenclatura Jira
- Epic: `EPIC-<AREA>-<NUM>`
- Feature: `FEAT-<AREA>-<NUM>`
- Story: `US-<AREA>-<NUM>`
- Task tecnica: `TASK-<AREA>-<NUM>`
- Bug: `BUG-<AREA>-<NUM>`

Areas:
- ADM = Painel do Barbeiro
- CLI = Portal do Cliente
- CORE = Autenticacao, sessao, configuracao, infra

## Definicao de pronto (DoD)
- Fluxo funcional no desktop e mobile.
- Validacao de estados vazios e erros.
- Sem overflow visual.
- Lint e typecheck sem erros.
- Rotas e permissoes funcionando.

## Roadmap por Epic

### EPIC-ADM-01 - Shell, Navegacao e Busca Global
Objetivo:
- Garantir navegacao rapida e busca global funcional no painel admin.

Features:
- FEAT-ADM-01: Sidebar e header responsivos.
- FEAT-ADM-02: Busca global desktop + mobile.
- FEAT-ADM-03: Acoes rapidas na busca (novo agendamento, nova comanda, etc).

User Stories:
- US-ADM-01: Como barbeiro, quero buscar paginas e dados para navegar mais rapido.
- US-ADM-02: Como barbeiro, quero usar busca no mobile para executar acoes.
- US-ADM-03: Como barbeiro, quero navegar por teclado na busca (setas, enter, esc).

Criterios de aceite:
- Campo de busca no desktop e no mobile.
- Resultados por pagina, cliente, servico e profissional.
- Acoes rapidas com clique e Enter.
- Fecha ao clicar fora e com Esc.

---

### EPIC-ADM-02 - Dashboard Operacional
Objetivo:
- Exibir indicadores e acoes imediatas da operacao diaria.

Features:
- FEAT-ADM-04: Cards de metricas.
- FEAT-ADM-05: Agenda do dia.
- FEAT-ADM-06: Receita e metas.
- FEAT-ADM-07: Horarios de pico.

User Stories:
- US-ADM-04: Como barbeiro, quero ver agenda e status do dia em um lugar.
- US-ADM-05: Como barbeiro, quero acompanhar receita e metas rapidamente.

Criterios de aceite:
- Cards renderizando com dados.
- Estados vazios com CTA.
- Modal de revisao de metas funcional.

---

### EPIC-ADM-03 - Agenda e Agendamentos
Objetivo:
- Operar agenda da barbearia com criacao e gestao de compromissos.

Features:
- FEAT-ADM-08: Calendario e filtros por data.
- FEAT-ADM-09: Novo agendamento por modal.
- FEAT-ADM-10: Bloqueios e pausas de agenda.
- FEAT-ADM-11: Historico do cliente e sugestao de recompra.

User Stories:
- US-ADM-06: Como barbeiro, quero criar agendamento com cliente e servico.
- US-ADM-07: Como barbeiro, quero bloquear horarios indisponiveis.

Criterios de aceite:
- Criacao de agendamento funcional.
- Filtros por dia/mes/ano funcionais.
- Lista de servicos e clientes no modal.

---

### EPIC-ADM-04 - Caixa e Comandas
Objetivo:
- Controlar abertura, movimentacao e fechamento de caixa.

Features:
- FEAT-ADM-12: Visao de saldo e indicadores de caixa.
- FEAT-ADM-13: Nova comanda.
- FEAT-ADM-14: Movimentacoes manuais (entrada/saida).
- FEAT-ADM-15: Tela detalhada de comandas.

User Stories:
- US-ADM-08: Como barbeiro, quero abrir e fechar comandas.
- US-ADM-09: Como barbeiro, quero registrar entradas e saidas avulsas.

Criterios de aceite:
- Comanda criada com itens e pagamento.
- Status da comanda atualizado.
- Movimentacao impacta indicadores do caixa.

---

### EPIC-ADM-05 - Clientes
Objetivo:
- Gerenciar base de clientes e relacionamento.

Features:
- FEAT-ADM-16: Cadastro de cliente.
- FEAT-ADM-17: Listagem e edicao.
- FEAT-ADM-18: Indicadores de carteira.
- FEAT-ADM-19: Recompras e acoes recomendadas.

User Stories:
- US-ADM-10: Como barbeiro, quero cadastrar clientes com dados principais.
- US-ADM-11: Como barbeiro, quero editar cliente rapidamente.

Criterios de aceite:
- Cadastro salva e aparece na listagem.
- Edicao funcional via modal.
- Cards de saude da base atualizados.

---

### EPIC-ADM-06 - Financeiro
Objetivo:
- Consolidar controle financeiro em modulos.

Features:
- FEAT-ADM-20: Visao geral financeira.
- FEAT-ADM-21: Contas bancarias.
- FEAT-ADM-22: Categorias financeiras.
- FEAT-ADM-23: Formas de pagamento.
- FEAT-ADM-24: Exportacao e simulacao de taxa.

User Stories:
- US-ADM-12: Como barbeiro, quero visualizar receita, despesa e lucro.
- US-ADM-13: Como barbeiro, quero cadastrar contas e categorias.

Criterios de aceite:
- Modulos renderizam dados e filtros.
- Cadastros via modal funcionais.
- Exportacao de relatorio disponivel.

---

### EPIC-ADM-07 - Planos e Assinaturas
Objetivo:
- Gerenciar recorrencia e monetizacao por planos.

Features:
- FEAT-ADM-25: Criacao de plano (dados, valores, regras, servicos).
- FEAT-ADM-26: Gerenciamento de planos.
- FEAT-ADM-27: Gerenciamento de assinaturas.
- FEAT-ADM-28: Inadimplentes e cobranca.

User Stories:
- US-ADM-14: Como barbeiro, quero criar planos com beneficios e limites.
- US-ADM-15: Como barbeiro, quero pausar e reativar assinaturas.
- US-ADM-16: Como barbeiro, quero cobrar inadimplentes com mensagem pronta.

Criterios de aceite:
- Plano criado aparece para clientes.
- Assinatura atualiza status corretamente.
- Cobranca marca status de envio.

---

### EPIC-ADM-08 - Profissionais e Servicos
Objetivo:
- Estruturar equipe e catalogo de servicos.

Features:
- FEAT-ADM-29: Cadastro e gestao de profissionais.
- FEAT-ADM-30: Cadastro de funcoes da equipe.
- FEAT-ADM-31: Cadastro de servicos.
- FEAT-ADM-32: Exibicao, ordenacao e destaque de servicos.

User Stories:
- US-ADM-17: Como barbeiro, quero cadastrar profissionais com horario e comissao.
- US-ADM-18: Como barbeiro, quero ordenar e destacar servicos no catalogo.

Criterios de aceite:
- Profissional criado/atualizado com status.
- Servico criado e visivel na listagem.
- Ordenacao e destaque persistem na sessao.

---

### EPIC-ADM-09 - Empresa e Personalizacao
Objetivo:
- Configurar identidade, dados e assets da empresa.

Features:
- FEAT-ADM-33: Dados da empresa e endereco.
- FEAT-ADM-34: Redes sociais e contatos.
- FEAT-ADM-35: Upload de logo, icone e carrossel.
- FEAT-ADM-36: Restaurar padrao (reset de uploads e configuracoes).

User Stories:
- US-ADM-19: Como barbeiro, quero personalizar o portal com minha marca.
- US-ADM-20: Como barbeiro, quero restaurar configuracao padrao quando necessario.

Criterios de aceite:
- Upload aparece no portal do cliente.
- Reset remove assets e volta para default.

---

### EPIC-CLI-01 - Login, Cadastro e Sessao do Cliente
Objetivo:
- Garantir acesso do cliente ao portal com UX simples.

Features:
- FEAT-CLI-01: Tela de login do cliente.
- FEAT-CLI-02: Modo alternavel Entrar/Cadastrar.
- FEAT-CLI-03: Edicao de perfil.
- FEAT-CLI-04: Logout para tela correta do cliente.

User Stories:
- US-CLI-01: Como cliente, quero entrar com meus dados.
- US-CLI-02: Como cliente, quero me cadastrar e entrar no mesmo fluxo.

Criterios de aceite:
- Toggle Entrar/Cadastrar funcional.
- Cadastro salva perfil.
- Logout volta para /cliente/login.

---

### EPIC-CLI-02 - Home e Navegacao do Portal
Objetivo:
- Exibir resumo e atalhos para o cliente.

Features:
- FEAT-CLI-05: Home com resumo de plano e proximo horario.
- FEAT-CLI-06: Bottom nav mobile.
- FEAT-CLI-07: Header com perfil e edicao.

User Stories:
- US-CLI-03: Como cliente, quero ver rapidamente meu proximo atendimento.

Criterios de aceite:
- Home carrega informacoes basicas.
- Navegacao inferior funcional em mobile.

---

### EPIC-CLI-03 - Agendamento do Cliente
Objetivo:
- Permitir agendar de ponta a ponta com boa experiencia mobile.

Features:
- FEAT-CLI-08: Fluxo por etapas.
- FEAT-CLI-09: Regras para cliente com plano vs sem plano.
- FEAT-CLI-10: Data/hora responsivo.
- FEAT-CLI-11: Carrinho de servicos no rodape.
- FEAT-CLI-12: Modal de confirmacao de agendamento concluido.

User Stories:
- US-CLI-04: Como cliente, quero selecionar servicos e horario sem quebra no mobile.
- US-CLI-05: Como assinante, quero ver servicos do plano primeiro.

Criterios de aceite:
- Sem overflow em telas pequenas.
- Carrinho exibe quantidade e itens.
- Modal de sucesso ao concluir.

---

### EPIC-CLI-04 - Meus Agendamentos
Objetivo:
- Dar autonomia para acompanhar, remarcar e cancelar.

Features:
- FEAT-CLI-13: Lista de agendamentos.
- FEAT-CLI-14: Detalhes por modal.
- FEAT-CLI-15: Remarcacao.
- FEAT-CLI-16: Cancelamento com regra de prazo.

User Stories:
- US-CLI-06: Como cliente, quero remarcar sem depender de atendimento manual.

Criterios de aceite:
- Remarcacao salva no estado da sessao.
- Cancelamento respeita regra de prazo.

---

### EPIC-CLI-05 - Planos, Checkout e Cobranca
Objetivo:
- Permitir adesao, gestao e acompanhamento de assinatura no portal.

Features:
- FEAT-CLI-17: Tela de planos premium.
- FEAT-CLI-18: Checkout de assinatura.
- FEAT-CLI-19: Cadastro de cartao completo.
- FEAT-CLI-20: Consumo de beneficios e extras.
- FEAT-CLI-21: Historico financeiro e comprovante.

User Stories:
- US-CLI-07: Como cliente, quero comparar planos e assinar com facilidade.
- US-CLI-08: Como cliente, quero adicionar cartao e concluir checkout.

Criterios de aceite:
- Plano selecionado atualiza assinatura.
- Cartao validado e salvo.
- Historico mostra status e valor.

---

### EPIC-CORE-01 - Configuracao e Persistencia
Objetivo:
- Garantir coerencia de configuracao entre admin e portal.

Features:
- FEAT-CORE-01: Persistencia local (localStorage/sessionStorage).
- FEAT-CORE-02: Sync event entre modulos.
- FEAT-CORE-03: Migracao de assets legados.

User Stories:
- US-CORE-01: Como sistema, quero sincronizar alteracoes de configuracao em tempo real.

Criterios de aceite:
- Alteracoes no admin refletem no portal.
- Evento de sync dispara atualizacao visual.

## Planejamento sugerido de Sprints

### Sprint 1 - Fundacao e navegacao
Escopo:
- EPIC-ADM-01
- EPIC-CORE-01 (parcial)

Entrega esperada:
- Shell admin estavel, busca global funcional, base de navegacao pronta.

### Sprint 2 - Operacao diaria
Escopo:
- EPIC-ADM-02
- EPIC-ADM-03
- EPIC-ADM-04

Entrega esperada:
- Dashboard, agenda e caixa prontos para uso diario.

### Sprint 3 - Cadastros e financeiro
Escopo:
- EPIC-ADM-05
- EPIC-ADM-06
- EPIC-ADM-08

Entrega esperada:
- Gestao de clientes, equipe, servicos e financeiro consolidada.

### Sprint 4 - Planos, assinaturas e empresa
Escopo:
- EPIC-ADM-07
- EPIC-ADM-09

Entrega esperada:
- Ciclo comercial completo no admin com personalizacao de marca.

### Sprint 5 - Portal do cliente (acesso e home)
Escopo:
- EPIC-CLI-01
- EPIC-CLI-02

Entrega esperada:
- Login/cadastro e home do cliente prontos.

### Sprint 6 - Portal do cliente (agendamento e planos)
Escopo:
- EPIC-CLI-03
- EPIC-CLI-04
- EPIC-CLI-05

Entrega esperada:
- Jornada completa do cliente: agendar, gerir horarios, assinar plano e pagar.

## Backlog tecnico transversal
- TASK-CORE-01: Padronizar textos ASCII sem acentos em areas especificas quando necessario.
- TASK-CORE-02: Melhorar cobertura de validacoes de formulario.
- TASK-CORE-03: Revisao de responsividade em breakpoints criticos.
- TASK-CORE-04: Revisao de acessibilidade (labels, foco, navegacao teclado).
- TASK-CORE-05: Revisao de estados vazios e mensagens de erro.

## Riscos e dependencias
- Dependencia de dados mock/local para simulacoes de negocio.
- Necessidade de definicao futura de backend persistente.
- Possivel ajuste de regras comerciais (plano, inadimplencia, descontos) durante homologacao.
