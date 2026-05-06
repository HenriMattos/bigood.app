# Design System - MyDash Barber

## 1) Objetivo e escopo
Este documento descreve o design system da plataforma inteira:
- Painel Admin (`/app/(admin)/*`)
- Portal do Cliente (`/app/cliente/*`)
- Biblioteca de UI compartilhada (`/components/ui/*`)

Objetivos principais:
- Consistencia visual entre modulos
- Rapidez para construir telas novas sem "reinventar layout"
- Melhor experiencia em desktop e mobile
- Base unica de tokens (cores, tipografia, espacamento, raio, sombra)

---

## 2) Stack visual
- Next.js + React + TypeScript
- Tailwind CSS + tokens CSS em `app/globals.css`
- Primitivos UI baseados em Radix/Shadcn (`components.json` com style `radix-luma`)
- Icones: `@hugeicons/*`

Arquivo-fonte principal de design tokens:
- `app/globals.css`

---

## 3) Cores (tokens oficiais)

### 3.1 Light mode
Tokens base semanticos:
- `--background`: `oklch(0.9842 0.0034 247.8575)`
- `--foreground`: `oklch(0.235 0.055 145)`
- `--card`: `oklch(1 0 0)`
- `--primary`: `oklch(0.857 0.1698 134.5554)`
- `--primary-foreground`: `oklch(0.2869 0.0839 135.0504)`
- `--secondary`: `oklch(0.9683 0.0069 247.8956)`
- `--muted`: `oklch(0.9683 0.0069 247.8956)`
- `--muted-foreground`: `oklch(0.47 0.035 150)`
- `--destructive`: `oklch(0.673 0.2146 25.0397)`
- `--border` / `--input`: `oklch(0.9288 0.0126 255.5078)`
- `--ring`: `oklch(0.857 0.1698 134.5554)`

### 3.2 Dark mode
Tokens base semanticos:
- `--background`: `oklch(0.1980 0.0300 264.6600)`
- `--foreground`: `oklch(0.9842 0.0034 247.8575)`
- `--card`: `oklch(0.2520 0.0340 261.2000)`
- `--primary`: `oklch(0.857 0.1698 134.5554)`
- `--secondary`: `oklch(0.3340 0.0300 260.2000)`
- `--muted`: `oklch(0.2960 0.0280 260.2000)`
- `--muted-foreground`: `oklch(0.7107 0.0351 256.7878)`
- `--destructive`: `oklch(0.3958 0.1331 25.723)`
- `--border` / `--input`: `oklch(0.3920 0.0220 259.9000)`

### 3.3 Sidebar tokens
- `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`
- Esses tokens devem ser usados na navegacao lateral do admin, nao cores soltas.

### 3.4 Graficos
- `--chart-1` ... `--chart-5` sao a paleta de dados para dashboards.

---

## 4) Tipografia

Fontes oficiais:
- Sans principal: `Plus Jakarta Sans`
- Mono: `JetBrains Mono`
- Serif fallback: `Georgia`

Origem:
- Carregadas via `next/font/google` em `app/layout.tsx`
- Mapeadas para tokens:
  - `--font-sans`
  - `--font-mono`
  - `--font-serif`

Escala de uso (padrao de componentes atuais):
- `text-xs`: labels, metadata, subtitulos
- `text-sm`: texto funcional, campos, conteudo secundario
- `text-base` e `text-lg`: titulos de secao
- `text-xl`/`text-2xl`: metricas e headings de destaque

---

## 5) Espacamento, raios e sombras

### 5.1 Spacing
- Unidade base: `--spacing: 0.25rem`
- Layout usa muito `gap-2`, `gap-3`, `gap-4`, `p-3`, `p-4` e escalas responsivas.

### 5.2 Radius
- `--radius: 0.75rem`
- Escala derivada:
  - `--radius-sm`: `calc(var(--radius) - 4px)`
  - `--radius-md`: `calc(var(--radius) - 2px)`
  - `--radius-lg`: `var(--radius)`
  - `--radius-xl` ate `--radius-4xl` para cards e containers premium

### 5.3 Shadows
- Sistema com tokens `--shadow-2xs` ate `--shadow-2xl`
- Light: sombras leves
- Dark: sombras mais profundas (maior opacidade e blur)

---

## 6) Layout da plataforma

### 6.1 Admin Shell
Classes-chave:
- `.admin-app`
- `.admin-container`
- `.admin-metric-grid`
- `.admin-split-grid`

Padroes:
- Sidebar fixa no desktop e drawer no mobile
- Header com busca e acoes rapidas
- Conteudo com ScrollArea
- Fundo gradiente sutil animado (`premium-gradient-flow`)

### 6.2 Portal Cliente
Classes-chave:
- `.client-portal`
- `.client-portal-main-scroll`
- Bottom nav fixa no mobile

Padroes:
- Header compacto com marca + perfil
- Navegacao inferior de 4 itens
- Conteudo centralizado com largura maxima progressiva
- Safe area para iOS (`env(safe-area-inset-bottom)`)

---

## 7) Componentes e estilos reutilizaveis

### 7.1 Botao (`components/ui/button.tsx`)
Variantes oficiais:
- `default` (acao principal)
- `outline`
- `secondary`
- `ghost`
- `destructive`
- `link`

Tamanhos:
- `xs`, `sm`, `default`, `lg`, `icon` e derivados

Detalhe visual:
- `default` usa efeito `green-shine` para reforcar CTA primario

### 7.2 Cards
Classes oficiais:
- `.premium-card` (card generico elevado com borda premium)
- `.plan-premium-card` (card de planos com brilho/ray animado)
- `.client-card` (card base do portal)
- `.client-premium-card` (versao premium do portal)
- `.client-plan-option-card` e `.client-choice-card`

### 7.3 Dialogs
- Base: `components/ui/dialog.tsx`
- Portal cliente usa skin dedicada `.client-dialog` para manter contraste e linguagem visual.

### 7.4 Tabelas
- `SimpleTable` alterna:
  - Card list em mobile
  - Tabela horizontal com scroll em desktop

---

## 8) Motion e microinteracoes

Animacoes principais:
- `premium-gradient-flow` (fundos dinamicos)
- `admin-rise` (entrada suave de blocos)
- `submenu-open` (expansao da sidebar)
- `light-ray` / `plan-card-ray` (efeito de brilho)

Acessibilidade de movimento:
- `@media (prefers-reduced-motion: reduce)` desliga animacoes e transicoes.

---

## 9) Responsividade (breakpoints praticos)

Breakpoints usados no sistema:
- `sm` (~540px+ para ajustes de container/grid no admin)
- `md` (>=768px)
- `lg` (>=1024px)
- `xl/2xl` e cortes especificos (`1180`, `1360`, `1400-1499`, `1600`)

Regra de ouro:
- Em telas pequenas, evitar "apertar tabela". Preferir cards empilhados e fluxo vertical.

---

## 10) Theming do Portal Cliente

Configuracao em:
- `components/company/client-portal-config.ts`

Temas prontos atuais:
- `claro-premium`
- `escuro-premium`

O tema altera variaveis CSS globais em runtime (primary, background, border, etc.) e sincroniza admin <-> portal via `CLIENT_PORTAL_SYNC_EVENT`.

---

## 11) Iconografia e linguagem visual
- Biblioteca oficial: Hugeicons
- Admin: icones com peso funcional e leitura rapida
- Cliente: icones maiores em bottom nav e acoes de perfil

Diretrizes:
- Evitar mistura de bibliotecas de icone sem necessidade
- Priorizar consistencia de tamanho entre itens da mesma area

---

## 12) Acessibilidade e usabilidade

Padroes ja adotados:
- Estados de foco (`focus-visible` + `ring`)
- Contraste semantico por token (`foreground`, `muted-foreground`)
- Labels de controles e `aria-label` em botoes icon-only
- Navegacao por teclado na busca global do admin (setas, enter, esc)

Checklist para features novas:
- Verificar foco visivel
- Validar contraste em light e dark
- Testar navegacao por teclado
- Confirmar funcionamento em mobile sem overflow horizontal

---

## 13) Regras de implementacao (Do / Dont)

Do:
- Usar tokens (`bg-background`, `text-foreground`, `border-border`, etc.)
- Reutilizar componentes de `components/ui` e classes utilitarias existentes
- Manter semantica de variantes de botao e badge
- Testar em admin + portal quando mexer em tokens globais

Dont:
- Hardcode de cor aleatoria em cada tela
- Criar novo padrao de card quando ja existe `premium-card`/`client-card`
- Ignorar mobile em fluxos administrativos
- Ignorar `prefers-reduced-motion` em animacoes novas

---

## 14) Fontes de verdade no codigo
- `app/globals.css`
- `app/layout.tsx`
- `components.json`
- `components/ui/button.tsx`
- `components/admin/admin-shell.tsx`
- `components/admin/section-card.tsx`
- `components/admin/metric-card.tsx`
- `components/admin/simple-table.tsx`
- `components/client-portal/portal-chrome.tsx`
- `components/company/client-portal-config.ts`
