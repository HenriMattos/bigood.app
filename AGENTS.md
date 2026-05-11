# Bigood — Project Instructions for Codex

## Product Context

Bigood is a SaaS platform for barbershops.

The product includes three main areas:

1. Public institutional landing page
2. Barber/admin dashboard
3. Customer portal for scheduling services and managing barbershop plans

The project currently has a high-fidelity frontend built with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Hugeicons
- React Context
- localStorage and mock data

The current frontend is visually approved. The goal is to prepare the codebase for a real backend using Spec Driven Development.

## Current Product Decision

Bigood does not allow public self-registration for barbershop owners.

The institutional landing page must not expose plan prices.

The commercial flow is consultative:

Visitor → Agendar demonstração → Commercial contact → Internal configuration → Login access

The public site must focus on lead generation and demo scheduling.

Allowed public CTAs:

- Agendar demonstração
- Falar com especialista
- Ver como funciona
- Entrar

Forbidden public CTAs:

- Cadastrar
- Criar conta
- Começar agora
- Assinar plano
- Escolher plano
- Comprar plano
- Checkout

The login route is only for users who already have access.

## Design Lock

The current Bigood visual identity is approved.

Do not change without explicit user authorization:

- colors
- fonts
- spacing
- layout
- border radius
- shadows
- button style
- card style
- responsiveness
- Tailwind classes related only to visual appearance
- shadcn/ui visual patterns
- global CSS

Allowed changes:

- file organization
- TypeScript types
- schemas
- services
- mocks
- API contracts
- validation logic
- security checks
- loading/error/empty/success states
- documentation
- removal of obsolete public CTAs

## Engineering Principles

Always follow Spec Driven Development.

Before implementing, check whether a related spec exists.

If no spec exists, propose or create one before coding when the task changes behavior, data flow, access control, or backend integration.

Every feature should have:

- clear objective
- user roles
- main flow
- business rules
- required data
- validation rules
- loading state
- empty state
- error state
- success state
- API contract or future service boundary

## Architecture Rules

Do not put business rules directly inside page components when they can be extracted.

Prefer this separation:

- pages/routes: composition and routing
- components: UI
- features: domain-specific logic
- services: data access
- types: TypeScript models
- schemas: Zod validation
- mocks: temporary mock data
- docs: specs and contracts

Mock data must not remain deeply coupled to pages.

Services may temporarily read from mock data, but components should consume services, not raw mock databases.

## Backend-Ready Rules

When preparing frontend for backend:

- isolate localStorage usage
- isolate mock database usage
- define service functions
- define API contracts
- define request/response types
- validate forms with schemas when possible
- never trust frontend for payment, subscription, authorization, or scheduling conflicts

Critical backend validations:

- authentication
- authorization
- companyId isolation
- unitId isolation
- appointment conflicts
- subscription status
- payment status
- role permissions

## Multitenancy Rules

Bigood is multi-tenant.

Every private business entity must belong to a company.

Use companyId as the main isolation key.

Use unitId when the data belongs to a specific branch/unit.

A barber/admin must never access data from another company.

A customer must never access data from another customer.

The public barbershop portal may use slug for discovery, but backend data access must resolve and validate companyId.

## Safety Rules for Codex

Before editing files:

1. Read the relevant files.
2. Identify affected routes/components.
3. State the intended change.
4. Preserve visual design.
5. Avoid broad rewrites.
6. Prefer small, reviewable diffs.
7. Do not delete routes unless explicitly asked.
8. Do not alter dashboard or client portal when working only on landing.
9. Do not alter landing when working only on dashboard or portal.
10. Do not introduce new dependencies without explaining why.

After editing:

1. Run typecheck/build/lint when available.
2. Report changed files.
3. Report behavior changes.
4. Report whether visual design was preserved.
5. Report pending backend decisions.
6. Report risks or uncertain assumptions.

## Required Final Report Format

After every task, respond with:

### Summary

What changed.

### Files changed

List each file and purpose.

### Visual impact

State whether layout/CSS/design was preserved.

### Product impact

State how the change affects the Bigood product flow.

### Backend impact

List APIs, services, schemas, or contracts needed.

### Risks

List possible issues or assumptions.

### Next step

Suggest the next safe engineering step.
