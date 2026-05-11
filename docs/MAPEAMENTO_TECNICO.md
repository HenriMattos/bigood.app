# Relatório de Mapeamento Técnico: Projeto Bigood

## 1. Visão Geral do Projeto
O Bigood é uma plataforma SaaS (Software as a Service) multi-tenant voltada para o gerenciamento de barbearias. O sistema integra três frentes principais:
- **Institucional**: Landing page para conversão de novos barbeiros.
- **Administrativo (Dashboard)**: Painel de controle para o proprietário gerenciar agenda, financeiro, clientes e profissionais.
- **Portal do Cliente**: Interface mobile-first para que os clientes finais realizem agendamentos e assinem planos de fidelidade.

Atualmente, o projeto é um **Frontend-only Prototype**, onde toda a persistência é simulada via `localStorage` e os dados iniciais são provenientes de um arquivo de banco de dados fictício (`database.ts`).

## 2. Stack Utilizada
- **Framework**: Next.js 16.2.4 (App Router).
- **Linguagem**: TypeScript 5.9.3.
- **Estilização**: Tailwind CSS 4.2.1 com uso intensivo de variáveis CSS para temas dinâmicos.
- **UI Components**: shadcn/ui (Radix UI).
- **Ícones**: Hugeicons (`@hugeicons/react` e `@hugeicons/core-free-icons`).
- **Animações**: `tw-animate-css` e Framer Motion.
- **Gerenciamento de Estado**: React Context (`use-auth.tsx`) e LocalStorage.
- **Autenticação**: Mock customizado via cookies e tokens em `lib/auth.ts`.

## 3. Estrutura de Pastas
- `/app`: Definição de rotas, layouts e APIs (Next.js App Router).
- `/components`:
    - `/admin`: Componentes específicos do painel do barbeiro.
    - `/client-portal`: Componentes da interface mobile do cliente.
    - `/landing`: Seções da landing page pública.
    - `/login`: Componentes de autenticação e cards de acesso.
    - `/ui`: Componentes base do shadcn/ui.
- `/hooks`: Hooks customizados (ex: `use-auth.tsx`).
- `/lib`: Utilitários, configurações de marca e lógica de autenticação.
- `/public`: Ativos estáticos (imagens, logos).
- `/docs`: Documentação e especificações.

## 4. Rotas e Páginas Existentes

| Caminho da Rota | Arquivo | Objetivo | Usuário | Dependência de Backend |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Landing Page pública | Público | Baixa (CMS/Config) |
| `/login` | `app/login/page.tsx` | Tela de autenticação | Público | Alta (Auth API) |
| `/cadastro` | `app/cadastro/page.tsx` | Criação de conta SaaS | Barbeiro | Alta (User/Company API) |
| `/dashboard` | `app/(admin)/dashboard/page.tsx` | Resumo operacional/estratégico | Barbeiro | Alta (Analytics API) |
| `/agenda` | `app/(admin)/agenda/page.tsx` | Gestão de horários | Barbeiro | Alta (Appointments API) |
| `/clientes` | `app/(admin)/clientes/page.tsx` | CRM de clientes | Barbeiro | Alta (Customers API) |
| `/caixa` | `app/(admin)/caixa/page.tsx` | PDV / Abertura de comandas | Barbeiro | Alta (Transactions API) |
| `/financeiro`| `app/(admin)/financeiro/page.tsx`| DRE e fluxo de caixa | Barbeiro | Alta (Financial API) |
| `/barbearia/[slug]`| `app/barbearia/[slug]/page.tsx`| Portal mobile do cliente | Cliente | Alta (Tenant/Booking API) |

## 5. Componentes Principais

| Componente | Caminho | Função | Lógica |
| :--- | :--- | :--- | :--- |
| `DashboardView` | `components/admin/dashboard-view.tsx` | Painel principal com métricas | Sim (Filtros/Metas) |
| `ClientPortalShell`| `components/client-portal/client-portal-shell.tsx` | Orquestrador do portal mobile | Sim (Tab Switch/State) |
| `BookingFlow` | `components/client-portal/booking-flow.tsx` | Fluxo de agendamento em passos | Sim (Step management) |
| `AuthCard` | `components/login/auth-card.tsx` | Form de login/registro | Sim (API Mock calls) |
| `SimpleTable` | `components/admin/simple-table.tsx` | Tabela genérica para o admin | Não (Apenas visual) |

## 6. Dados Mockados
O arquivo central é `components/admin/database.ts`.

- **Entidades Mockadas**:
    - `clients`: 45 registros gerados randomicamente.
    - `services`: Catálogo de serviços (Corte, Barba).
    - `plans`: Planos de assinatura (Essencial, VIP).
    - `subscriptions`: Vínculo entre clientes e planos.
    - `agendaEvents`: Agendamentos do dia.
    - `comandas`: Registros de vendas no caixa.
    - `analytics`: KPIs de faturamento, ticket médio e retenção.

**Sugestão de API**: Todos esses dados devem ser migrados para um banco de dados relacional (PostgreSQL) com acesso via REST API.

## 7. Fluxos de Usuário Existentes

1. **Onboarding do Barbeiro**:
    - Cadastro (`/cadastro`) -> Escolha de Plano (`/escolher-plano`) -> Checkout (`/checkout`) -> Dashboard.
2. **Operação Diária (Barbeiro)**:
    - Login -> Dashboard -> Agenda -> Caixa (Comandas).
3. **Agendamento (Cliente)**:
    - Acesso via `/barbearia/slug` -> Escolha de serviço -> Escolha de profissional -> Escolha de data/hora -> Confirmação.
4. **Fidelização (Cliente)**:
    - Aba "Planos" no portal -> Escolha de plano -> Checkout simulado -> Assinatura ativa.

## 8. Entidades de Domínio Identificadas

| Entidade | Campos Atuais (Frontend) | Campos Recomendados (Backend) |
| :--- | :--- | :--- |
| **Company** | name, slug, logo, address | id (UUID), ownerId, subscriptionId, settings (JSON) |
| **Customer** | name, phone, email | id, companyId, totalSpent, lastVisit, points |
| **Professional**| name, role, schedule | id, companyId, userId, commissionRate |
| **Service** | name, price, duration | id, companyId, categoryId, isActive |
| **Appointment** | date, time, status, service | id, customerId, professionalId, serviceId, startTime, endTime |
| **Subscription**| planName, price, renewsAt | id, customerId, planId, stripeSubscriptionId, status |

## 9. Regras de Negócio Aparentes

- **Regras Visíveis**:
    - Clientes sem plano ativo podem agendar serviços avulsos.
    - O dashboard admin alterna entre visão "Operacional" (dia) e "Estratégica" (mês).
    - Comandas só podem ser marcadas como "Paga" se houver um método de pagamento associado.
- **Regras a Confirmar**:
    - Existe limite de profissionais por plano SaaS?
    - A comissão dos profissionais é calculada automaticamente no financeiro?
- **Validação no Backend (Obrigatório)**:
    - Verificação de conflito de horários na agenda.
    - Validação de status de pagamento de assinaturas para liberar benefícios.

## 10. Pontos Críticos de Segurança
1. **Multitenancy**: O `slug` na URL do portal do cliente é a única chave de distinção. No backend, cada query deve ser filtrada por `companyId`.
2. **Autenticação**: O sistema atual usa um mock em `lib/auth.ts`. É necessário implementar JWT real com `HttpOnly` cookies.
3. **Autorização**: Distinguir claramente o que um `barbeiro` (admin da loja) pode fazer vs um `cliente` (agendamento).

## 11. Preparação para Backend (Endpoints Sugeridos)

- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`.
- **Tenants**: `GET /api/companies/:slug`, `PATCH /api/companies/settings`.
- **Booking**: `GET /api/slots/available`, `POST /api/appointments`.
- **Financeiro**: `GET /api/finance/report`, `POST /api/checkout/session`.

## 12. Problemas de Arquitetura Encontrados
- **Acoplamento**: Páginas consomem o objeto `database` diretamente, dificultando a substituição por chamadas de API.
- **Lógica de Estado**: O `ClientPortalShell` possui >1000 linhas, misturando UI de diferentes abas e lógica de persistência em LocalStorage.
- **Tipagem**: Muitos tipos estão espalhados ou definidos localmente dentro de componentes.

## 13. Oportunidades de Refatoração
1. **Camada de Services**: Criar `/lib/services` para isolar as chamadas de dados.
2. **Zustand/Context**: Centralizar o estado do portal do cliente para evitar prop-drilling.
3. **Schemas**: Implementar `Zod` para validar as entidades vindas da API.

## 14. Sugestão de Arquitetura Ideal
```text
src/
  app/              # Rotas e Layouts
  features/         # Módulos isolados (admin, client-portal, auth)
    admin/
      components/
      services/     # Abstração de API
      hooks/
    client/
  components/       # UI genérica (shadcn)
  lib/              # Utils e Configs
  types/            # Definições globais de TypeScript
```

## 15. Ordem Recomendada de Refatoração
1. **Fase 1**: Extrair todos os tipos de `database.ts` para um diretório `/types`.
2. **Fase 2**: Criar a camada de `services` que encapsula o acesso ao `database.ts`.
3. **Fase 3**: Implementar `React Query` para gerenciar o fetch desses services.
4. **Fase 4**: Quebrar componentes gigantes em sub-componentes menores.

## 16. Resumo Executivo
- **Estado Atual**: Protótipo de alta fidelidade visual, funcional no frontend, mas totalmente dependente de mocks.
- **Nível de Maturidade**: **Design-Ready / Code-Draft**.
- **Principais Riscos**: Segurança e isolamento de dados entre empresas (multitenancy).
- **Próximos Passos**: Iniciar o **Spec Driven Development** para a API.

---
*Relatório gerado em 11 de maio de 2026.*
