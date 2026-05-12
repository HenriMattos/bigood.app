# Bigood Codebase Conventions

> Last updated: 2026-05-11
> Status: Active

---

## Table of Contents

1. [Naming Conventions](#1-naming-conventions)
2. [File Organization](#2-file-organization)
3. [Import Patterns](#3-import-patterns)
4. [CSS Conventions](#4-css-conventions)
5. [shadcn/ui Conventions](#5-shadcnui-conventions)
6. [Commit Message Style](#6-commit-message-style)
7. [Spec Driven Development](#7-spec-driven-development)
8. [Design Lock Rules](#8-design-lock-rules)

---

## 1. Naming Conventions

### Components (React)

| Construct | Convention | Example |
|---|---|---|
| Component function | PascalCase | LandingPage, Button, ClientPortalShell |
| Component file | kebab-case | landing-page.tsx, client-portal-shell.tsx |
| UI primitives (shadcn) | kebab-case | utton.tsx, ccordion.tsx |
| Default export | Named export | export function LandingPage() (never export default) |
| Props interface | PascalCase, co-located | Defined inline or in a dedicated types file |

### Functions, Hooks, and Variables

| Construct | Convention | Example |
|---|---|---|
| Helper/utility functions | camelCase | ormatCurrency, generateId, cn |
| Custom hooks | camelCase with 'use' prefix | useAuth, useClientAuth, useDragScroll |
| Context providers | PascalCase | AuthProvider, ClientAuthProvider, ThemeProvider |
| Constants | camelCase or UPPER_SNAKE | limeButtonClass, AUTH_COOKIE_NAME |
| Types and interfaces | PascalCase | ClientAuthUser, SessionPayload, ValidationErrors |
| Enums (when used) | PascalCase | (not yet present in codebase) |

### Files and Directories

| Construct | Convention | Example |
|---|---|---|
| Component directories | kebab-case | client-portal/, landing/, dmin/ |
| Data/mock files | kebab-case | landing-data.ts, caixa-data.ts |
| Schema files | kebab-case | client-auth.ts |
| Service files | kebab-case | client-auth.ts |
| Type files | kebab-case | client-auth.ts |
| Route groups (Next.js) | parenthesized | '(admin)/', '(app)/' |
| Dynamic routes (Next.js) | bracket notation | '[slug]/' |

---

## 2. File Organization

### Top-level structure

`
app/                    # Next.js App Router pages and layouts
components/             # Reusable React components
  ui/                   # shadcn/ui primitives
  landing/              # Landing page components
  admin/                # Admin/dashboard components
  client-portal/        # Client portal components
  company/              # Company/barbershop configuration
  login/                # Login page components
docs/                   # Documentation and specs
  specs/                # Feature specifications
  architecture/         # Architecture decisions
hooks/                  # Custom React hooks (context providers)
lib/                    # Utility functions and shared logic
schemas/                # Zod-like validation schemas
services/               # Data access service functions
types/                  # TypeScript type definitions
public/                 # Static assets
graphify-out/           # AST index (gitignored)
.planning/              # Internal planning documents
`

### Per-domain co-location

Components, their data mocks, and closely related helpers are co-located in domain directories:

`
components/
  landing/
    landing-page.tsx       # Composition root
    landing-header.tsx     # Sub-component
    brand-mark.tsx         # Sub-component
    demo-form.tsx          # Sub-component
    landing-data.ts        # Mock data and constants
  client-portal/
    client-portal-shell.tsx
    client-portal-header.tsx
    client-bottom-nav.tsx
    booking-flow.tsx
    checkout-screen.tsx
    client-auth-modal.tsx
    client-portal-data.ts  # Mock data and helpers
    use-drag-scroll.ts     # Co-located hook
`

### Separation of concerns

- **pages/routes** ('app/'): Composition and routing only
- **components** ('components/'): UI rendering
- **features**: Domain-specific logic (extracted from pages when possible)
- **services** ('services/'): Data access (mock or future API)
- **types** ('types/'): TypeScript models/interfaces
- **schemas** ('schemas/'): Validation logic
- **docs** ('docs/'): Specs and API contracts

### One component per file

Each file exports a single primary component. Helper components used in only one place may remain in the same file (as seen in 'landing-page.tsx' with 'Container', 'SectionHeader', 'SectionEyebrow', etc.).

---

## 3. Import Patterns

### Absolute imports with '@/' prefix

All internal imports use the '@/' alias, configured in 'tsconfig.json':

`json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./*"]
  }
}
`

### Examples from the codebase

`	ypescript
// Component imports
import { Button } from "@/components/ui/button"
import { LandingPage } from "@/components/landing/landing-page"
import { BrandMark } from "@/components/landing/brand-mark"
import { CheckoutScreen } from "./checkout-screen"              // sibling relative

// Service imports
import * as authService from "@/services/client-auth"
import type { ClientAuthUser } from "@/types/client-auth"

// Library/shared imports
import { cn } from "@/lib/utils"
import { AUTH_COOKIE_NAME, getAuthSession } from "@/lib/auth"
import { LANDING_IMAGES } from "@/lib/marketing-assets"

// Hook imports
import { useAuth } from "@/hooks/use-auth"
import { useClientAuth } from "@/hooks/use-client-auth"

// Schema imports
import { validateRegister, validateLogin } from "@/schemas/client-auth"
`

### External imports

`	ypescript
// React/Next.js
import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

// Hugeicons
import { ArrowRight01Icon, Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

// shadcn/ui / CVA
import { cva, type VariantProps } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
`

### Import ordering (convention observed)

1. React / Next.js core
2. Third-party packages (Hugeicons, Radix, CVA, etc.)
3. Internal absolute imports ('@/components', '@/lib', '@/hooks', etc.)
4. Relative sibling imports ('./component', './data')

Blank line between groups.

---

## 4. CSS Conventions

### Technology stack

- **Tailwind CSS v4** (imported via '@import "tailwindcss"')
- **shadcn/ui** Tailwind preset ('@import "shadcn/tailwind.css"')
- **tw-animate-css** ('@import "tw-animate-css"')
- CSS custom properties (variables) for theming
- No CSS modules or styled-components

### Utility-first with Tailwind

Components are styled almost exclusively with Tailwind utility classes. Custom CSS is kept in 'app/globals.css' under '@layer base' and '@layer components'.

### CSS variables for theming

The design system is driven by CSS variables defined in ':root' and '.dark':

`css
:root {
  --background: oklch(0.9842 0.0034 247.8575);
  --foreground: oklch(0.235 0.055 145);
  --primary: oklch(0.857 0.1698 134.5554);
  --radius: 0.75rem;
}
`

These are mapped to Tailwind theme values via '@theme inline {}'.

### Domain-specific CSS classes

| Prefix | Scope | File |
|---|---|---|
| 'landing-*' | Public landing page | app/globals.css |
| 'admin-*' | Admin dashboard | app/globals.css |
| 'premium-*' | Premium card styles | app/globals.css |
| 'client-*' | Client portal (mobile) | app/globals.css |
| 'plan-premium-*' | Plan card highlights | app/globals.css |
| 'motion-*' | Animations | app/globals.css |
| 'green-shine' | Light ray effect on buttons | app/globals.css |
| 'organic-auth' | Auth page theme | app/globals.css |

### Key class patterns

**Landing page**: Wrapped in '.landing-page' parent class.

**Admin dashboard**: Wrapped in '.admin-app' parent class.

**Client portal**: Wrapped in '.client-portal-app' parent class.

### Button pattern strings

Button class strings are often stored as constants at the top of component files:

`	ypescript
const limeButtonClass =
  "h-11 rounded-full border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] ..."
`

### The 'cn()' utility

All components use the 'cn()' helper from '@/lib/utils.ts' to merge Tailwind classes.

### Prettier plugin for Tailwind

The project uses 'prettier-plugin-tailwindcss' for automatic class sorting.

---

## 5. shadcn/ui Conventions

### Configuration

Defined in 'components.json' with 'radix-luma' style, 'hugeicons' icon library, and aliases for '@/components/ui', '@/lib/utils', '@/hooks'.

### Location

All shadcn/ui primitives live in 'components/ui/':

`
components/ui/
  accordion.tsx
  button.tsx
  checkbox.tsx
  dialog.tsx
  input.tsx
  label.tsx
  popover.tsx
  scroll-area.tsx
  select.tsx
  slider.tsx
  textarea.tsx
`

### Component structure pattern

- Use 'cva' from 'class-variance-authority' for variant definitions
- Use 'Slot.Root' from 'radix-ui' for polymorphic 'asChild' behavior
- Use 'cn()' from '@/lib/utils' for class merging
- Export both the component and the 'cva' variants object

---

## 6. Commit Message Style

The project follows **Conventional Commits** based on the git log:

| Commit | Type |
|---|---|
| 'chore: add Bigood Codex instructions and consistency skill' | chore |
| 'Prepare project for GitHub' | (plain, early commits) |
| 'Initial commit' | (plain) |

### Recommended convention for new contributions

`
<type>: <description>

Types:
- feat: A new feature
- fix: A bug fix
- refactor: Code restructuring without feature change
- chore: Tooling, config, dependencies
- docs: Documentation only
- style: Formatting, linting (no code change)
- test: Adding or fixing tests
- spec: Adding or updating feature specs
`

---

## 7. Spec Driven Development

Every feature that changes behavior, data flow, access control, or backend integration must have an accompanying spec document.

### Location

Specs live in 'docs/specs/' as Markdown files following the naming convention '{feature-name}.spec.md'.

### Current specs

- 'docs/specs/client-auth.spec.md' - Client authentication in barbershop portal

### Required spec sections

1. **Objective** - Clear goal of the feature
2. **User roles** - Who is involved
3. **Main flow** - Step-by-step happy path
4. **Business rules** - Constraints and logic
5. **Required data** - Data structures needed
6. **Validation rules** - Form/input validation
7. **Loading state** - What the user sees during loading
8. **Empty state** - What the user sees when no data exists
9. **Error state** - What the user sees on failure
10. **Success state** - What the user sees on completion
11. **API contract** - Request/response types or service boundary

---

## 8. Design Lock Rules

### The current visual identity is approved and locked.

Do **not** change without explicit user authorization:

- Colors (including Tailwind color classes and CSS variables)
- Fonts (Plus Jakarta Sans, JetBrains Mono)
- Spacing and layout (padding, margins, grid structure)
- Border radius values
- Shadows
- Button styles (height, radius, font-weight, hover/active states)
- Card styles (border, radius, padding, shadow)
- Responsiveness breakpoints and mobile behavior
- Tailwind classes related only to visual appearance
- shadcn/ui visual patterns
- Global CSS ('app/globals.css')

### Changes that are allowed without authorization:

- File organization and directory structure
- TypeScript types and interfaces
- Validation schemas
- Service functions and data access patterns
- Mock data files
- API contracts
- Security checks
- Loading, error, empty, and success states
- Documentation
- Removal of obsolete public CTAs (per product decisions)

### Product area boundaries

- Do not alter dashboard when working only on landing
- Do not alter landing when working only on dashboard or portal
- Do not delete routes unless explicitly asked
- Avoid broad rewrites; prefer small, reviewable diffs
