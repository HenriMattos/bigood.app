# Bigood Project Structure

This document provides a complete directory tree of the codebase, highlighting key files and their purpose.

---

## Project Root

\\\
mydashbarber/
  .agents/                        # Agent configuration files
  .env                            # Environment variables (local only)
  .env.example                    # Environment variable template
  .gitignore                      # Git ignore rules
  .opencode/                      # OpenCode agent workspace
  .planning/                      # Planning documentation
    codebase/
      ARCHITECTURE.md             # This directory's output: architecture doc
      STRUCTURE.md                # This directory's output: structure doc
  .prettierignore                 # Prettier ignore rules
  .prettierrc                     # Prettier configuration
  .qwen/                          # Qwen agent workspace
  AGENTS.md                       # Agent instructions for code assistants
  SPEC.md                         # Backend specification document (91 lines)
  components.json                 # shadcn/ui configuration (Radix Luma style)
  eslint.config.mjs               # ESLint flat config
  graphify-out/                   # Graphify AST index (gitignored)
    graph.json                    # Symbol index for code navigation
  next-env.d.ts                   # Next.js TypeScript declarations
  next.config.mjs                 # Next.js configuration (empty)
  package.json                    # Dependencies and scripts
  package-lock.json               # Lock file
  postcss.config.mjs              # PostCSS configuration (Tailwind v4)
  proxy.ts                        # Middleware (session validation, route protection)
  tsconfig.json                   # TypeScript configuration
  tsconfig.tsbuildinfo            # TypeScript incremental build info
  public/                         # Static assets
    brand/                        # Bigood brand SVGs and PNGs
      bigood-logo.svg
      bigood-logo-white.svg
      bigood-mark.svg
      bigood-mark-dark.svg
      bigood-portal-logo.svg
      bigood-portal-icon.png
    images/                       # Landing page images (dashboard screenshots, barber photos)
    .gitkeep
  node_modules/                   # Dependencies (gitignored)
\\\

---

## \pp/\ Directory (Next.js App Router)

\\\
app/
  globals.css                     # Global styles: Tailwind v4 + shadcn/ui CSS variables
  layout.tsx                      # Root layout: JetBrains Mono + Plus Jakarta Sans fonts,
                                  #   ThemeProvider (no-op), AuthProvider (barber auth context)
  page.tsx                        # Landing page (/) — renders <LandingPage />
  icon.png                        # App icon (favicon)
  apple-icon.png                  # Apple touch icon
  favicon.ico                     # Favicon
  opengraph-image.png             # OpenGraph image

  # --- Public Routes ---

  login/
    page.tsx                      # /login — Barber/admin login form with <AuthCard />

  agendar-demonstracao/
    page.tsx                      # /agendar-demonstracao — Demo scheduling form with <DemoForm />

  cadastro/
    page.tsx                      # /cadastro — Redirects to /login?mode=signup (legacy route)

  escolher-plano/
    page.tsx                      # /escolher-plano — Plan selection page ("use client"),
                                  #   renders plan cards with pricing (requires session)

  checkout/
    page.tsx                      # /checkout — Plan checkout/confirmation page,
                                  #   renders <CheckoutActions /> with plan details (requires session)

  conta/
    page.tsx                      # /conta — Account settings page (server component),
                                  #   reads session cookie server-side, redirects if unauthenticated

  barbearia/
    [slug]/
      page.tsx                    # /barbearia/[slug] — Client portal page (async, server component),
                                  #   renders <ClientPortalShell slug={slug} />

  # --- Protected Admin Routes ((admin) route group) ---

  (admin)/
    layout.tsx                    # Admin layout — wraps children in <AdminShell />

    dashboard/
      page.tsx                    # /dashboard — Renders <DashboardView />

    agenda/
      page.tsx                    # /agenda — Renders <AgendaView />

    caixa/
      page.tsx                    # /caixa — Renders <CaixaView />
      comandas/
        page.tsx                  # /caixa/comandas — Renders <ComandasView />

    clientes/
      page.tsx                    # /clientes — Client overview list
      cadastrar/
        page.tsx                  # /clientes/cadastrar — Register new client form
      listagem/
        page.tsx                  # /clientes/listagem — Full client listing
      recompras/
        page.tsx                  # /clientes/recompras — Repurchase insights

    financeiro/
      page.tsx                    # /financeiro — Renders <FinanceiroView />
      contas-bancarias/
        page.tsx                  # /financeiro/contas-bancarias — Bank accounts
      categorias/
        page.tsx                  # /financeiro/categorias — Financial categories
      formas-pagamento/
        page.tsx                  # /financeiro/formas-pagamento — Payment methods

    planos/
      page.tsx                    # /planos — Plan overview
      criar/
        page.tsx                  # /planos/criar — Create new plan form
      gerenciar/
        page.tsx                  # /planos/gerenciar — Plan management

    assinaturas/
      page.tsx                    # /assinaturas — Subscription overview
      gerenciar/
        page.tsx                  # /assinaturas/gerenciar — Subscription management
      inadimplentes/
        page.tsx                  # /assinaturas/inadimplentes — Overdue subscriptions

    profissionais/
      page.tsx                    # /profissionais — Professional overview
      cadastrar/
        page.tsx                  # /profissionais/cadastrar — Register new professional
      gerenciar/
        page.tsx                  # /profissionais/gerenciar — Professional management

    servicos/
      page.tsx                    # /servicos — Service catalog overview
      cadastrar/
        page.tsx                  # /servicos/cadastrar — Create new service
      exibicao/
        page.tsx                  # /servicos/exibicao — Service display configuration
      listagem/
        page.tsx                  # /servicos/listagem — Full service listing

    empresa/
      page.tsx                    # /empresa — Renders <CompanyView /> (company settings)

  # --- API Routes ---

  api/
    auth/
      login/
        route.ts                  # POST /api/auth/login — Validates admin credentials,
                                  #   creates HMAC-session, sets cookie
      session/
        route.ts                  # GET /api/auth/session — Reads cookie, returns user payload
      logout/
        route.ts                  # POST /api/auth/logout — Clears session cookie
      signup/
        route.ts                  # POST /api/auth/signup — Creates account (hasActivePlan=false)
    billing/
      activate/
        route.ts                  # POST /api/billing/activate — Activates plan, updates session
\\\

---

## \components/\ Directory

\\\
components/
  .gitkeep                        # Placeholder

  # --- shadcn/ui Primitives ---

  ui/
    accordion.tsx                 # Radix Accordion (used in landing FAQ)
    button.tsx                    # shadcn Button (cva variants)
    checkbox.tsx                  # Radix Checkbox
    dialog.tsx                    # Radix Dialog
    input.tsx                     # shadcn Input
    label.tsx                     # Radix Label
    popover.tsx                   # Radix Popover
    scroll-area.tsx               # Radix ScrollArea
    select.tsx                    # Radix Select
    slider.tsx                    # Radix Slider
    textarea.tsx                  # shadcn Textarea

  # --- Landing Page (Institutional) ---

  landing/
    landing-page.tsx              # Main page composition: Header, Hero, Pain, Features,
                                  #   Compare, DashboardShowcase, PortalShowcase, FAQ, CTA, Footer
    landing-header.tsx            # Sticky header with nav links + auth state (useAuth)
    landing-data.ts               # Static data: navLinks, trustItems, painPoints, features,
                                  #   comparisons, faqs, plans (Plan type, PlanKey), planLabels
    demo-form.tsx                 # Demo scheduling form component
    brand-mark.tsx                # Bigood logo/brand mark display (supports compact + inverse)
    checkout-actions.tsx          # Checkout confirmation actions (calls /api/billing/activate)

  # --- Admin Dashboard ---

  admin/
    admin-shell.tsx               # Main admin layout: sidebar navigation, header with search bar,
                                  #   user menu, logout, responsive mobile sidebar overlay
    database.ts                   # ** CENTRAL MOCK DATABASE ** (645 lines)
                                  #   Types: Client, ServiceCatalogItem, Plan, Subscription,
                                  #   Professional, AgendaEvent, FinancialMovement, Comanda,
                                  #   CashMovement, BankAccount, PaymentMethod, etc.
                                  #   Data: company, services, plans, clients, subscriptions,
                                  #   professionals, agendaEvents, comandas, paymentMethods,
                                  #   revenueWeek, peakHours, analytics
    nav-items.ts                  # Sidebar navigation configuration (Dashboard, Agenda, Caixa,
                                  #   Clientes, Financeiro, Planos, Assinaturas, Profissionais,
                                  #   Servicos, Empresa — with children for sub-routes)
    dashboard-view.tsx            # Dashboard metrics display
    agenda-view.tsx               # Appointment/agenda view
    caixa-view.tsx                # Cash register view
    caixa-data.ts                 # Cash register mock data helpers
    comandas-view.tsx             # Order tickets (comandas) view
    comanda-card.tsx              # Individual comanda card component
    clientes-data.tsx             # Client mock data helpers
    clientes-list-manager.tsx     # Client list management component
    services-view.tsx             # Service catalog management view
    financeiro-view.tsx           # Financial management view
    company-view.tsx              # Company settings view
    metric-card.tsx               # Reusable metric display card
    section-card.tsx              # Generic section card wrapper
    simple-table.tsx              # Reusable simple table component
    status-badge.tsx              # Status badge component
    empty-state.tsx               # Empty state placeholder component
    responsive-form.tsx           # Responsive form layout component
    date-utils.ts                 # Date formatting utility functions
    onboarding-guide.tsx          # First-time onboarding guide component
    catalog-data.ts               # Service catalog data helpers

  # --- Client Portal ---

  client-portal/
    client-portal-shell.tsx       # Main portal shell (1276 lines): multi-tab layout
                                  #   (Home, Appointments, Plans, Profile) with auth gating,
                                  #   booking flow, checkout screen, auth modal orchestration
    client-portal-header.tsx      # Portal header: company logo, name, auth state button
    client-portal-data.ts         # Portal data types + mock data layer (331 lines):
                                  #   ClientPortalData, ClientPortalPlan, ClientPortalAppointment,
                                  #   ClientProfile, ClientSubscription, BarberCompany, etc.
                                  #   Functions: getClientPortalData(), readClientPortalState(),
                                  #   saveClientPortalState(), formatCurrency(), formatDateLabel()
    client-auth-modal.tsx         # Login/register modal (tabs) for client authentication
    booking-flow.tsx              # Multi-step booking flow (service -> professional -> date -> time)
    checkout-screen.tsx           # Plan subscription checkout overlay
    client-bottom-nav.tsx         # Mobile bottom navigation (home, appointments, plans, profile)
    use-drag-scroll.ts            # Custom hook for horizontal drag-to-scroll carousels

  # --- Login ---

  login/
    auth-card.tsx                 # Login form card: email + password fields, submit handler,
                                  #   calls /api/auth/login, redirects based on hasActivePlan

  # --- Company ---

  company/
    company-assets.ts             # localStorage key constants for company branding
                                  #   (logo, icon, carousel images, portal banner, description,
                                  #   opening hours, slogan, slug, sync event)
    commercial-storage.ts         # localStorage read/write helpers for commercial data
                                  #   (plans, subscriptions with fallback to database.ts data)

  theme-provider.tsx              # No-op ThemeProvider (passes children through)
\\\

---

## \lib/\ Directory (Libraries)

\\\
lib/
  .gitkeep                        # Placeholder
  auth.ts                         # HMAC SHA-256 session auth (134 lines):
                                  #   createAuthSession(), getAuthSession(), verifyAuthSession(),
                                  #   verifyActiveSubscription() — uses Web Crypto API
                                  #   Constants: AUTH_COOKIE_NAME, AUTH_SESSION_MAX_AGE
                                  #   Types: AuthUser, SessionPayload
                                  #   Credentials: getAdminCredentials() (env-based)
  brand-assets.ts                 # Brand asset URL constants (logos, marks, portal images)
  marketing-assets.ts             # Marketing image URL constants (landing page images)
  utils.ts                        # Utility: cn() function (clsx + tailwind-merge)
\\\

---

## \hooks/\ Directory

\\\
hooks/
  .gitkeep                        # Placeholder
  use-auth.tsx                    # Barber/Admin auth hook (103 lines):
                                  #   AuthProvider (React Context) + useAuth() hook
                                  #   Reads session from GET /api/auth/session
                                  #   Listens for "storage" and "bigood_auth_sync" events
                                  #   Provides: user, isLoading, refresh(), setAuthenticatedUser(), logout()
  use-client-auth.tsx             # Client portal auth hook (127 lines):
                                  #   ClientAuthProvider (React Context, requires slug) + useClientAuth()
                                  #   Calls services/client-auth.ts for register, login, logout
                                  #   Provides: user, token, isLoading, isAuthenticated,
                                  #   login(slug, identifier, password), register(slug, input), logout(slug)
\\\

---

## \	ypes/\ Directory (TypeScript Type Definitions)

\\\
types/
  client-auth.ts                  # Client authentication types (28 lines):
                                  #   ClientAuthUser, ClientAuthState, ClientLoginInput, ClientRegisterInput
\\\

---

## \schemas/\ Directory (Validation Schemas)

\\\
schemas/
  client-auth.ts                  # Client auth validation functions (56 lines):
                                  #   ValidationErrors type, validateRegister(), validateLogin()
                                  #   Rules: name required, phone required, email valid format,
                                  #   password >= 6 chars, confirmPassword must match
\\\

---

## \services/\ Directory (Service Layer)

\\\
services/
  client-auth.ts                  # Client auth service (134 lines):
                                  #   registerClient(slug, input) — localStorage CRUD
                                  #   loginClient(slug, input) — plain-text password check
                                  #   logoutClient(slug) — clears session
                                  #   getClientSession(slug) — reads session from localStorage
                                  #   Storage keys: bigood.clientPortal.{slug}.auth
                                  #               bigood.clientPortal.{slug}.auth.users
\\\

---

## \docs/\ Directory (Documentation)

\\\
docs/
  architecture/
    access-and-sales-model.md     # Business model documentation
  specs/
    client-auth.spec.md           # Client auth spec (123 lines): objective, scopes, flows,
                                  #   business rules, state descriptions, acceptance criteria
  bigood - refatore.md            # Refactoring notes
  bigood-assets.md                # Asset documentation
  bigood-identidade-visual.md     # Visual identity documentation
  bigood-portal do cliente.md     # Client portal documentation
  MAPEAMENTO_TECNICO.md           # Technical mapping notes
\\\

---

## \public/\ Directory

\\\
public/
  .gitkeep
  brand/                          # Brand assets (SVG logos, icon PNG)
    bigood-logo.svg
    bigood-logo-white.svg
    bigood-mark.svg
    bigood-mark-dark.svg
    bigood-portal-logo.svg
    bigood-portal-icon.png
  images/                         # Marketing images
\\\

---

## Configuration Files

| File | Purpose |
|---|---|
| \
ext.config.mjs\ | Next.js config (empty, default) |
| \	sconfig.json\ | TypeScript config with path aliases (\@/components\, \@/lib\, etc.) |
| \postcss.config.mjs\ | PostCSS with Tailwind CSS v4 |
| \eslint.config.mjs\ | ESLint flat config |
| \components.json\ | shadcn/ui config (Radix Luma style, Hugeicons icon library) |
| \.prettierrc\ | Prettier config |
| \.env.example\ | Environment variable template |
| \package.json\ | Scripts: dev, build, start, lint, format, typecheck |

---

## Key Files Summary

| File | Lines | Purpose |
|---|---|---|
| \pp/layout.tsx\ | 53 | Root layout (fonts, ThemeProvider, AuthProvider) |
| \pp/(admin)/layout.tsx\ | 9 | Admin layout (AdminShell wrapper) |
| \pp/page.tsx\ | 32 | Landing page composition |
| \proxy.ts\ | 78 | Middleware (route protection, session validation) |
| \lib/auth.ts\ | 134 | HMAC session creation/verification |
| \hooks/use-auth.tsx\ | 103 | Barber/admin auth context + hook |
| \hooks/use-client-auth.tsx\ | 127 | Client auth context + hook |
| \	ypes/client-auth.ts\ | 28 | Client auth type definitions |
| \schemas/client-auth.ts\ | 56 | Client auth validation schemas |
| \services/client-auth.ts\ | 134 | Client auth service (localStorage) |
| \components/admin/database.ts\ | 645 | Central mock database (types + data) |
| \components/admin/admin-shell.tsx\ | 727 | Admin shell (sidebar, search bar, logout) |
| \components/client-portal/client-portal-shell.tsx\ | 1276 | Client portal shell (multi-tab) |
| \components/client-portal/client-portal-data.ts\ | 331 | Portal data types + mock data layer |
| \components/landing/landing-page.tsx\ | 926 | Landing page sections |
| \components/landing/landing-header.tsx\ | 185 | Landing header with auth state |
| \components/login/auth-card.tsx\ | 173 | Login form |
| \components/company/company-assets.ts\ | 21 | localStorage key constants |
| \components/company/commercial-storage.ts\ | 65 | localStorage commercial data helpers |
| \docs/specs/client-auth.spec.md\ | 123 | Client auth specification |
| \SPEC.md\ | 91 | Backend specification |
| \pp/globals.css\ | 1234 | Global CSS (Tailwind v4 + CSS variables) |

---

## File Count Overview

| Directory | File Count | Description |
|---|---|---|
| \pp/\ | 42 | Routes, layouts, pages, API routes |
| \components/ui/\ | 11 | shadcn/ui primitives |
| \components/landing/\ | 6 | Landing page components |
| \components/admin/\ | 20 | Admin dashboard components |
| \components/client-portal/\ | 8 | Client portal components |
| \components/login/\ | 1 | Login components |
| \components/company/\ | 2 | Company branding/storage |
| \lib/\ | 5 | Library modules |
| \hooks/\ | 3 | React hooks |
| \	ypes/\ | 1 | TypeScript types |
| \schemas/\ | 1 | Validation schemas |
| \services/\ | 1 | Service layer |
| \docs/\ | 7 | Documentation |
| \docs/specs/\ | 1 | Specs |
| \docs/architecture/\ | 1 | Architecture docs |
| \public/\ | 8+ | Static assets |
| \graphify-out/\ | 1 | AST index (gitignored) |
