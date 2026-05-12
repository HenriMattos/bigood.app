# Bigood Architecture

## Overview

Bigood is a SaaS platform for barbershops built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui (Radix Luma)**. The project is a high-fidelity frontend prepared for backend integration using Spec Driven Development. All data is currently mocked using localStorage and in-memory databases.

The platform serves **three distinct areas**:
1. **Institutional Landing Page** — public lead generation, no plan prices exposed
2. **Barber/Admin Dashboard** — authenticated, subscription-gated, multi-route management panel
3. **Client Portal** — mobile-first booking and subscription portal per barbershop slug

---

## 1. Next.js App Router Structure

### Route Groups

The project uses **two implicit route groups** via directory structure:

| Group | Path | Purpose |
|---|---|---|
| Root | / | Public pages (landing, login, checkout, etc.) |
| (admin) | /dashboard, /agenda, /clientes, etc. | Protected admin dashboard pages |

The (admin) route group does **not** use parentheses in the URL — it is a Next.js route group that shares a common layout without affecting the URL path.

### Route Layout

\\\
app/
  layout.tsx            # Root layout: ThemeProvider + AuthProvider
  (admin)/
    layout.tsx          # Admin layout: AdminShell (sidebar + header)
  barbearia/
    [slug]/
      page.tsx          # Client portal (no shared layout needed)
\\\

### Route Inventory

#### Public Root Routes (no auth required)

| Route | Component | Purpose |
|---|---|---|
| / | LandingPage | Institutional landing page |
| /login | AuthCard | Barber/admin login form |
| /agendar-demonstracao | DemoForm | Demo scheduling form (lead gen) |
| /cadastro | Redirect to /login?mode=signup | (redirect only) |
| /escolher-plano | Plan selection page | Subscription plan chooser (requires session) |
| /checkout | Checkout page | Plan checkout (requires session) |
| /conta | Account settings page | View account, plan status (requires session) |
| /barbearia/[slug] | ClientPortalShell | Client portal per barbershop |

#### Protected Admin Routes (admin) (requires auth + active plan)

| Route | Component | Purpose |
|---|---|---|
| /dashboard | DashboardView | Overview metrics |
| /agenda | AgendaView | Appointment management |
| /caixa | CaixaView | Cash register |
| /caixa/comandas | ComandasView | Order tickets |
| /clientes | Customer list | Client overview |
| /clientes/cadastrar | Register client form | New client |
| /clientes/listagem | Client listing | Full list with search |
| /clientes/recompras | Repurchase insights | Client retention |
| /financeiro | FinanceiroView | Financial overview |
| /financeiro/contas-bancarias | Bank accounts | Bank account management |
| /financeiro/categorias | Financial categories | Category management |
| /financeiro/formas-pagamento | Payment methods | Payment method config |
| /planos | Plan overview | Subscription plans |
| /planos/criar | Create plan form | New plan |
| /planos/gerenciar | Manage plans | Plan management |
| /assinaturas | Subscription overview | Client subscriptions |
| /assinaturas/gerenciar | Manage subscriptions | Subscription management |
| /assinaturas/inadimplentes | Overdue subscriptions | Delinquent clients |
| /profissionais | Professional overview | Staff management |
| /profissionais/cadastrar | Register professional | New staff |
| /profissionais/gerenciar | Manage professionals | Staff management |
| /servicos | Service overview | Service catalog |
| /servicos/cadastrar | Create service form | New service |
| /servicos/exibicao | Service display config | Visibility settings |
| /servicos/listagem | Service listing | Full catalog |
| /empresa | CompanyView | Company settings |

#### API Routes

| Route | Method | Purpose |
|---|---|---|
| /api/auth/login | POST | Barber admin login (creates HMAC session cookie) |
| /api/auth/session | GET | Read current session from cookie |
| /api/auth/logout | POST | Clear session cookie |
| /api/auth/signup | POST | Account creation (minimal, sets hasActivePlan=false) |
| /api/billing/activate | POST | Activate subscription plan (updates session) |

---

## 2. Component Organization

\\\
components/
  ui/                  # shadcn/ui primitives (button, input, dialog, select, etc.)
  landing/             # Landing page components
    landing-page.tsx   # Page composition (Hero, Pain, Features, Compare, etc.)
    landing-header.tsx # Sticky header with nav + auth state
    landing-data.ts    # Static content (nav links, plans, features, FAQs)
    demo-form.tsx      # Demo scheduling form
    brand-mark.tsx     # Bigood brand logo
    checkout-actions.tsx # Checkout plan confirmation actions
  admin/               # Dashboard admin components
    admin-shell.tsx    # Main admin layout shell (sidebar + header + scroll area)
    database.ts        # ** Mock in-memory database ** (all mock data + types)
    dashboard-view.tsx # Dashboard metrics
    agenda-view.tsx    # Appointment calendar/management
    caixa-view.tsx     # Cash register management
    caixa-data.ts      # Cash register mock data helpers
    comandas-view.tsx  # Order ticket management
    comanda-card.tsx   # Order ticket card UI
    clientes-data.tsx  # Customer mock data helpers
    clientes-list-manager.tsx # Customer list management
    services-view.tsx  # Service catalog management
    financeiro-view.tsx # Financial management
    company-view.tsx   # Company settings view
    nav-items.ts       # Sidebar navigation config
    metric-card.tsx    # Dashboard metric card
    section-card.tsx   # Generic section card
    simple-table.tsx   # Reusable simple table
    status-badge.tsx   # Status badge component
    empty-state.tsx    # Empty state component
    responsive-form.tsx # Responsive form layout
    date-utils.ts      # Date formatting utilities
    onboarding-guide.tsx # First-time onboarding guide
    catalog-data.ts    # Service catalog data helpers
  client-portal/       # Client portal components
    client-portal-shell.tsx # Main portal shell (tabs: home, appointments, plans, profile)
    client-portal-header.tsx # Portal header with company info + auth state
    client-portal-data.ts # Mock data fetching for portal
    client-auth-modal.tsx # Login/register modal for clients
    booking-flow.tsx   # Service booking flow (multi-step)
    checkout-screen.tsx # Plan subscription checkout
    client-bottom-nav.tsx # Mobile bottom navigation bar
    use-drag-scroll.ts # Drag-to-scroll hook
  login/               # Login page components
    auth-card.tsx      # Login form card
  company/             # Company brand/config storage
    company-assets.ts  # localStorage keys for company branding
    commercial-storage.ts # localStorage helpers for plans/subscriptions
  theme-provider.tsx   # No-op theme provider (pass-through)
\\\

---

## 3. Data Flow

### Current Architecture (Mock-based)

\\\
[mock data sources]
  components/admin/database.ts  ---> in-memory JS objects (services, plans, clients, etc.)
  components/client-portal/client-portal-data.ts ---> derives portal data from database.ts + localStorage
  services/client-auth.ts ---> localStorage-based client auth CRUD
  components/company/commercial-storage.ts ---> localStorage for plans/subscriptions overrides

       |
       v

[service layer]
  services/client-auth.ts ---> register, login, logout, getSession (all localStorage)
  lib/auth.ts ------------> HMAC-based session creation/verification (used by API routes)

       |
       v

[hooks layer]
  hooks/use-auth.tsx --------- React Context for barber/admin auth (reads /api/auth/session)
  hooks/use-client-auth.tsx -- React Context for client auth (calls services/client-auth.ts)

       |
       v

[components / pages]
  Pages compose components. Components consume hooks and context.
  Admin components import database.ts directly (tightly coupled).
  Client portal components import client-portal-data.ts and use-client-auth.
\\\

### Target Architecture (Backend-Ready)

The 	ypes/, schemas/, services/ directories have been seeded with the client-auth boundary:

| Directory | File | Purpose |
|---|---|---|
| 	ypes/client-auth.ts | Types | ClientAuthUser, ClientAuthState, ClientLoginInput, ClientRegisterInput |
| schemas/client-auth.ts | Validation | alidateRegister(), alidateLogin() |
| services/client-auth.ts | Service | egisterClient(), loginClient(), logoutClient(), getClientSession() (all localStorage mock) |

---

## 4. Authentication Separation

Bigood has **two completely independent authentication systems**:

### A. Barber/Admin Authentication (Cookie HMAC)

| Aspect | Detail |
|---|---|
| Entry point | /login page |
| Mechanism | HMAC SHA-256 session cookie |
| Cookie name | mydashbarber.session |
| Max age | 8 hours |
| Implementation | lib/auth.ts |
| API routes | /api/auth/login (POST), /api/auth/session (GET), /api/auth/logout (POST) |
| Client hook | hooks/use-auth.tsx — useAuth() context, wraps AuthProvider in root layout |
| Protection | proxy.ts middleware checks cookie on dashboard/subscription/account routes |
| Access flow | Login -> HMAC cookie set -> middleware validates -> dashboard access granted |

**Session Payload** (\SessionPayload\):
\\\	ypescript
{
  sub: string          // email (subject)
  email: string
  name?: string
  companyName?: string
  hasActivePlan: boolean
  planKey?: string
  exp: number          // expiration timestamp
}
\\\

**Current credentials** (hardcoded fallback, override via env):
- Email: \ADMIN_EMAIL\ env / \dmin@empresa.com\
- Password: \ADMIN_PASSWORD\ env / \dmin123\
- Secret: \AUTH_SECRET\ env / \dev-only-change-this-secret\

### B. Client Authentication (localStorage)

| Aspect | Detail |
|---|---|
| Entry point | /barbearia/[slug] portal |
| Mechanism | Plain localStorage (no crypto, mock-only) |
| Storage keys | \igood.clientPortal.{slug}.auth\ (session), \igood.clientPortal.{slug}.auth.users\ (user base) |
| Implementation | services/client-auth.ts |
| Client hook | hooks/use-client-auth.tsx — useClientAuth() context, requires slug |
| Password storage | Plain text (temporary, documented as insecure) |
| Scope | Per-barbershop slug only |
| Protection | No middleware — gated client-side via isAuthenticated |

**Client Auth User** (\ClientAuthUser\):
\\\	ypescript
{
  id: string
  name: string
  email: string
  phone: string
  barbershopSlug: string
  createdAt: string
}
\\\

---

## 5. Middleware Protection (\proxy.ts\)

The middleware at \proxy.ts\ intercepts all routes except static files:

\\\
Incoming Request
       |
       v
  Is dashboard route?
    YES -> Check session cookie
      -> No session: Redirect /login?next=
      -> No active plan: Redirect /escolher-plano
    NO
       v
  Is subscription or account route?
    YES -> Check session
      -> No session: Redirect /login?mode=signup
    NO
       v
  Is /login or /escolher-plano?
    YES -> If session has active plan -> Redirect /dashboard
    NO
       v
  NextResponse.next()
\\\

**Dashboard route prefixes** (gated by session + active plan):
\/agenda\, \/assinaturas\, \/caixa\, \/clientes\, \/dashboard\, \/empresa\, \/financeiro\, \/planos\, \/profissionais\, \/servicos\

**Subscription route prefixes** (gated by session only):
\/checkout\, \/escolher-plano\

**Account route** (gated by session only):
\/conta\

---

## 6. Multitenancy Preparation

The architecture is designed for multitenancy but currently uses a **single-tenant mock**. Key preparations:

- \companyId\ and \unitId\ are referenced in specs (\SPEC.md\) as future isolation keys
- \services/client-auth.ts\ uses \slug\ as the isolation key for client data
- \components/admin/database.ts\ exports a single \database\ object with one \company\
- \components/company/commercial-storage.ts\ provides localStorage helpers for per-company overrides
- All mock data types include fields that map to future SQL relationships

**Target state**:
- Every private entity belongs to a \company\
- \companyId\ is the primary isolation key
- \unitId\ isolates branch-level data
- Slug resolves to \companyId\ at the backend query level
- Cross-company data access is forbidden at the database query level

---

## 7. Key Architectural Decisions

### Visual Identity Lock
The visual design (colors, fonts, spacing, layout, border-radius, shadows, button/card styles, shadcn/ui patterns, global CSS) is **frozen** and must not be changed without explicit authorization.

### Mock Data Isolation
- \components/admin/database.ts\ is the central mock database for admin features (tightly coupled to components — known tech debt)
- \components/client-portal/client-portal-data.ts\ derives portal data from the admin database + localStorage overrides
- \services/client-auth.ts\ handles client auth entirely via localStorage

### No Public Self-Registration
Per product decision, Bigood does **not** allow public self-registration for barbershop owners. The flow is consultative:
> Visitor -> Agendar demonstracao -> Commercial contact -> Internal configuration -> Login access

### Allowed CTAs (Landing Page)
- \Agendar demonstracao\
- \Falar com especialista\
- \Ver como funciona\
- \Entrar\

### Forbidden CTAs (Landing Page)
- \Cadastrar\, \Criar conta\, \Comecar agora\, \Assinar plano\, \Escolher plano\, \Comprar plano\, \Checkout\

---

## 8. Dependency Stack

| Dependency | Version | Usage |
|---|---|---|
| next | 16.2.4 | App Router, API routes, middleware |
| react / react-dom | 19.2.4 | UI library |
| typescript | 5.9.3 | Type safety |
| tailwindcss | 4.2.1 | Utility-first CSS |
| @hugeicons/core-free-icons | 4.1.1 | Icon library |
| @hugeicons/react | 1.1.6 | React icon components |
| shadcn | 4.5.0 | UI component system |
| radix-ui | 1.4.3 | Headless UI primitives |
| class-variance-authority | 0.7.1 | Component variants |
| clsx / tailwind-merge | 2.1.1 / 3.5.0 | Class merging |
| next-themes | 0.4.6 | Theme (unused, ThemeProvider is no-op) |
| tw-animate-css | 1.4.0 | CSS animations |

---

## 9. Spec-Driven Development Status

The project has one completed spec:

| Spec | File | Status |
|---|---|---|
| Client Auth | \docs/specs/client-auth.spec.md\ | Implemented (mock) |

This describes all states (loading, error, validation, success, empty) for register, login, logout flows on the client portal.

The architecture is designed such that new features follow the pattern:
1. Write spec in \docs/specs/\
2. Define types in \	ypes/\
3. Define validation schemas in \schemas/\
4. Implement mock service in \services/\
5. Wire React context/hook in \hooks/\
6. Build UI components consuming the hook

---

## 10. Future Backend Boundary

When backend integration begins, the following boundaries should be respected:

| Frontend Responsibility | Backend Responsibility |
|---|---|
| UI rendering | Authentication |
| Form validation (client-side) | Authorization (role, companyId, unitId) |
| Navigation/routing | Appointment conflict detection |
| Visual feedback (loading, error, success, empty) | Subscription & payment status |
| Mock data display | Real data persistence |
| localStorage (temporary) | Database queries |
| | companyId / unitId isolation |
