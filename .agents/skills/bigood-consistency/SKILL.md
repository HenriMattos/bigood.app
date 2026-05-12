---
name: bigood-consistency
description: Use this skill for any Bigood task involving implementation, refactor, landing page changes, dashboard changes, client portal changes, specs, backend preparation, services, types, schemas, API contracts, or consistency review. This skill ensures Codex preserves the approved visual design, follows Spec Driven Development, respects product decisions, and produces backend-ready changes.
---

# Bigood Consistency Skill

## Purpose

This skill makes Codex work consistently on the Bigood codebase.

Bigood is a SaaS for barbershops with:

- institutional landing page
- barber/admin dashboard
- customer portal
- scheduling
- customer management
- services
- professionals
- subscription plans
- cash register/comandas
- finance
- future backend integration

The main objective is to evolve the project from a frontend-only prototype into a backend-ready SaaS without breaking the approved visual design.

## Absolute Rules

Never change visual design unless the user explicitly asks.

Do not change:

- colors
- typography
- layout
- spacing
- card style
- button style
- border radius
- shadows
- responsive behavior
- shadcn/ui style
- Tailwind classes used only for appearance
- global CSS

Do not redesign pages.

Do not "improve" visuals proactively.

Do not replace the Bigood identity.

## Current Product Strategy

Bigood uses a consultative sales flow.

The institutional site must not expose pricing.

Barbershop owners cannot publicly create their own accounts.

The public flow is:

Visitor → Agendar demonstração → Commercial contact → Internal setup → Login access

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

The `/login` route is for users who already have access.

Existing routes like `/cadastro`, `/escolher-plano`, or `/checkout` must not be deleted unless explicitly requested. They should simply stop being promoted publicly if the task is about the institutional site.

## Required Operating Flow

Before making changes, Codex must follow this sequence:

1. Understand the task.
2. Identify the affected area:
   - landing
   - auth
   - admin dashboard
   - client portal
   - scheduling
   - subscriptions
   - finance
   - services
   - professionals
   - customers
   - docs
3. Read the relevant files.
4. Check whether there is a related spec in `/docs/specs`.
5. Check whether there is a related contract in `/docs/contracts`.
6. Identify whether the task changes:
   - visual UI
   - product flow
   - business rule
   - data model
   - API contract
   - security behavior
7. Make the smallest safe change.
8. Preserve visual design.
9. Keep frontend ready for backend.
10. Run available validation commands.
11. Report results clearly.

## Spec Driven Development Protocol

For every feature or refactor, Codex must check:

- What is the objective?
- Who is the user?
- What is the main flow?
- What business rules apply?
- What data is required?
- What states exist?
  - loading
  - empty
  - error
  - success
- What validation is needed?
- What backend endpoint is needed?
- What security risks exist?
- What is the acceptance criterion?

If a task changes business logic and no spec exists, Codex should create or update a spec before implementation when possible.

## Backend-Ready Protocol

When working on frontend code, Codex must avoid hard coupling UI to mock data.

Preferred pattern:

- UI component renders data
- hook or service retrieves data
- service may temporarily use mock data
- future backend can replace service internals
- types define entity contracts
- schemas validate forms and payloads

Do not keep new business logic inside JSX if it belongs in a feature module, service, schema, or utility.

## Mock Data Rules

Existing mock data may be used temporarily.

However:

- do not spread new mock objects across many components
- do not create duplicate mock formats
- centralize mock data in `/mocks` or existing mock/database location
- expose mock access through services when preparing for backend

Bad pattern:

```tsx
const customers = [...]
```

inside a page.

Better pattern:

```tsx
const customers = await customerService.listCustomers()
```

where the service may temporarily read from mock data.

## TypeScript Rules

Prefer explicit domain types.

Avoid `any`.

Create or reuse domain types for:

- User
- Company
- Unit
- Customer
- Professional
- Service
- Plan
- Subscription
- Appointment
- Payment
- Command
- Transaction
- Role
- Permission

If a new payload is created, define its type.

If a form is added or modified, prefer a schema.

## Security Rules

Never trust frontend for critical operations.

Frontend may improve UX, but backend must validate:

- authentication
- authorization
- company ownership
- unit ownership
- customer ownership
- appointment availability
- subscription status
- payment status
- plan permissions
- role permissions

Every private entity must be scoped by `companyId`.

Every unit-specific entity should include `unitId`.

Public slug can identify a barbershop portal, but backend must resolve and validate the company.

## Landing Page Rules

When working on the institutional landing:

Allowed changes:

- copywriting
- CTA labels
- CTA destinations
- lead form structure
- removing public price exposure
- removing public signup promotion
- adapting sections to demo scheduling

Forbidden unless explicitly requested:

- changing dashboard
- changing client portal
- changing admin components
- changing global design
- changing CSS identity
- deleting auth routes
- deleting checkout routes

Landing must focus on:

- barbershops
- subscription plans for barbershop customers
- agenda management
- client management
- recurring revenue organization
- cash register/comandas
- finance
- portal do cliente
- scheduling a demo

## Admin Dashboard Rules

When working on the admin dashboard:

- preserve approved visual layout
- do not alter client portal
- do not alter landing
- maintain business separation by module
- prepare data through services
- do not add backend assumptions without documenting them

Main admin modules:

- dashboard
- agenda
- clientes
- caixa
- financeiro
- serviços
- profissionais
- planos
- configurações

## Client Portal Rules

When working on the client portal:

- preserve mobile-first behavior
- preserve current visual identity
- do not increase component size unnecessarily
- isolate scheduling flow logic
- keep booking rules explicit
- prepare appointment creation for backend validation

Critical flows:

- access barbershop by slug
- view barbershop profile
- choose service
- choose professional
- choose date/time
- confirm appointment
- view appointments
- view plans
- manage profile

## Refactor Rules

A refactor must not change behavior unless explicitly requested.

Before refactoring:

- identify existing behavior
- identify affected files
- preserve public API of components when possible
- avoid large rewrites
- avoid mixing refactor with feature changes

Safe refactor order:

1. extract types
2. extract mocks
3. create services
4. create schemas
5. isolate localStorage
6. split large components
7. add API contracts
8. prepare backend handoff

## Documentation Rules

When creating documentation, use:

```txt
/docs
  /architecture
  /specs
  /contracts
  /handoff
```

Important docs:

- design-lock.md
- frontend-architecture.md
- domain-model.md
- security-rules.md
- multitenancy.md
- data-flow.md
- backend-handoff.md
- pending-decisions.md
- refactor-roadmap.md

## Do Not Do

Do not:

- make broad changes without reading files
- invent backend behavior silently
- expose plan prices publicly on the institutional site
- reintroduce public barber signup
- create direct checkout CTAs for barbershop owners
- trust localStorage as secure persistence
- validate critical business rules only in frontend
- mix dashboard, landing, and client portal changes in one task unless requested
- install dependencies without justification
- remove existing routes without explicit instruction
- change visual design while doing architecture work

## Required Response After Work

At the end of every task, Codex must report:

### Summary

Short description of what was done.

### Files changed

List files and why they changed.

### Visual preservation

Confirm whether CSS/layout/design were preserved.

### Product flow impact

Explain whether CTAs, routes, access, or user journeys changed.

### Backend readiness

Mention services, types, schemas, contracts, or pending API needs.

### Validation

Mention commands run, such as:

- npm run lint
- npm run typecheck
- npm run build
- npm test

If a command was not available or failed, explain clearly.

### Risks and assumptions

List anything uncertain.

### Next recommended step

Suggest the next smallest safe step.
