# Bigood

**Sistema de gestão para barbearias** — Agenda, caixa, clientes, planos de assinatura e portal do cliente em um único painel.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript 5.9
- **Estilo:** Tailwind CSS v4 + shadcn/ui (Radix Luma)
- **Ícones:** Hugeicons
- **Testes:** Vitest (282 testes, 20 suites)
- **Infra:** Bun (runtime), Graphify (AST index)

## Estrutura

```
app/              → Rotas e layouts
├── (admin)/      → Dashboard do barbeiro
├── barbearia/    → Portal do cliente (slug)
├── landing/      → Landing page institucional
├── login/        → Login do barbeiro
└── api/          → API routes (legacy-dev)

components/
├── admin/        → Componentes do dashboard
├── client-portal/→ Componentes do portal do cliente
├── landing/      → Componentes da landing page
├── login/        → Componentes de autenticação
├── company/      → Configuração da empresa
└── ui/           → shadcn/ui components

hooks/            → React hooks por domínio
services/         → Camada de integração HTTP
types/            → TypeScript types por domínio
schemas/          → Validação de dados
tests/            → Testes Vitest
docs/             → Documentação
├── specs/        → Spec Driven Development specs
├── backend-handoff/ → Documentos de handoff
└── backend-readiness/ → Auditoria e status
```

## Domínios implementados

| Domínio | Status | Endpoints |
|---|---|---|
| Auth (admin + client) | ✅ Ready | 8 |
| Company / Units | ✅ Ready | 10 |
| Services / Professionals | ✅ Ready | 14 |
| Availability / Appointments | ✅ Ready | 14 |
| Clients | ✅ Ready | 8 |
| Plans / Subscriptions | ✅ Ready | 14 |
| Payments / Billing | ✅ Ready | 6 |
| Cash Register / Comandas | ✅ Ready | 19 |
| Financial | ✅ Ready | 15+ |
| Dashboard / Analytics | ✅ Ready | 8 |

## Comandos

```bash
npm run dev        # Desenvolvimento
npm run build      # Produção
npm run lint       # ESLint
npm run test:run   # Testes
npm run typecheck  # TypeScript
```

## Backend

O frontend está preparado para backend real. Consulte:

- `docs/specs/backend-contract.md` — Contrato completo da API
- `docs/backend-handoff/` — Documentos de handoff

### Variáveis de ambiente

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Licença

Projeto privado — Bigood.
