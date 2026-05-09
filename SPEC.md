# Documentação Técnica e Especificação de Backend - MyDashBarber

Este documento detalha os requisitos técnicos, arquitetura sugerida e especificações para a construção do backend do **MyDashBarber**, um sistema SaaS para gestão de barbearias com foco em experiência do cliente e eficiência operacional.

---

## 1. Visão Geral da Arquitetura

O sistema deve seguir o modelo **SaaS Multi-tenant**, onde uma única instância do backend atende a múltiplas barbearias (empresas).

- **Frontend Atual:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide React / Hugeicons.
- **Backend Sugerido:** Node.js (TypeScript) com Express ou NestJS, ou integração via Next.js Server Actions/Route Handlers para uma solução Fullstack inicial.
- **Banco de Dados:** Relacional (SQL) para garantir integridade referencial e suporte a transações financeiras.

---

## 2. Stack Recomendada (Custo-Benefício + Escalabilidade)

Para uma entrega ágil, robusta e com custo controlado:

- **Linguagem:** TypeScript (compartilhamento de tipos com o frontend).
- **Framework:** **NestJS** (altamente estruturado) ou **Next.js API Routes** (se optar por monólito).
- **ORM:** **Prisma** ou **Drizzle ORM**.
- **Banco de Dados:** **PostgreSQL** (Hospedagem sugerida: Supabase ou Neon.tech - ambos possuem tiers gratuitos excelentes).
- **Autenticação:** **NextAuth.js (Auth.js)** ou **Lucia Auth** para controle total, integrando com JWT ou Sessões em banco.
- **Pagamentos/Assinaturas:** **Stripe** ou **Asaas** (API robusta para o mercado brasileiro).
- **Armazenamento de Imagens:** **Uploadthing** ou **Cloudinary**.

---

## 3. Estrutura de Dados (Modelagem de Banco)

### Core: Multi-tenancy
Cada tabela principal deve possuir um `companyId` para isolamento de dados.

#### Principais Entidades:
1.  **Company (Barbearia):**
    - `id`, `name`, `slug` (para o portal do cliente), `logo`, `planType`, `status` (ativo/inadimplente).
2.  **User (Administradores/Profissionais):**
    - `id`, `email`, `password_hash`, `role` (ADMIN, MANAGER, STAFF), `companyId`.
3.  **Customer (Clientes):**
    - `id`, `name`, `email`, `phone`, `totalSpent`, `lastVisit`, `companyId`.
4.  **Service (Serviços):**
    - `id`, `name`, `price`, `duration` (em minutos), `category`, `companyId`.
5.  **Professional (Barbeiros):**
    - `id`, `name`, `avatar`, `bio`, `specialties`, `companyId`.
6.  **Appointment (Agendamentos):**
    - `id`, `date`, `startTime`, `endTime`, `status` (CONFIRMED, CANCELED, COMPLETED), `customerId`, `professionalId`, `serviceId`, `companyId`.
7.  **Transaction (Financeiro/Caixa):**
    - `id`, `type` (INCOME, EXPENSE), `amount`, `category`, `paymentMethod`, `date`, `companyId`.

---

## 4. Requisitos de Infraestrutura e Deploy

Para manter o custo baixo sem comprometer a segurança de um sistema empresarial:

- **Hospedagem Frontend/API:** **Vercel** (integração nativa com Next.js).
- **Banco de Dados:** **Supabase** (PostgreSQL Gerenciado). Oferece Backup automático, Auth integrado e Storage em um só lugar.
- **Segurança:**
    - SSL em todas as conexões.
    - Proteção contra SQL Injection (garantido pelo uso de ORM).
    - Rate Limiting para evitar ataques de força bruta no login.
    - Variáveis de Ambiente rigorosamente controladas (Segredos na Vercel).

---

## 5. Fluxos Críticos para o Backend

### A. Fluxo de Agendamento (Concurrency)
O sistema deve validar se o profissional está disponível no horário solicitado antes de confirmar o agendamento (evitar double-booking).

### B. Gestão de Assinaturas (Webhooks)
O backend deve ouvir Webhooks do gateway de pagamento (Stripe/Asaas) para:
- Ativar a conta após confirmação de pagamento.
- Bloquear acesso ao Dashboard se a assinatura expirar ou o pagamento falhar.

### C. Portal do Cliente (Slug Dinâmico)
A rota `/barbearia/[slug]` deve consultar o backend para buscar as informações específicas daquela empresa (`Company`) e seus respectivos serviços e profissionais.

---

## 6. Próximos Passos Sugeridos

1.  **Migração dos Dados Estáticos:** Substituir os arquivos `*-data.ts` (ex: `caixa-data.ts`, `services-view.tsx`) por chamadas de API (`fetch` ou React Server Components).
2.  **Configuração do Prisma:** Iniciar o schema baseado na estrutura sugerida acima.
3.  **Implementação de Auth:** Trocar o sistema de login simplificado atual por uma solução baseada em banco de dados.

---

**Nota ao Desenvolvedor:** O foco atual do projeto é a interface e UX. O backend deve priorizar a velocidade de resposta nas consultas de agenda e a precisão nos lançamentos financeiros do caixa.
