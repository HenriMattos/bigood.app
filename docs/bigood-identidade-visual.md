# Bigood — Landing Page Design System

## Objetivo

Este documento define o padrão visual da **Landing Page do Bigood** e deve ser usado pelo Codex como referência para criar novas páginas mantendo a mesma identidade visual.

O foco é preservar:

- Mesma paleta de cores.
- Mesma sensação premium.
- Mesma estrutura de componentes.
- Mesma linguagem visual.
- Mesma responsividade.
- Mesma hierarquia tipográfica.
- Mesmo estilo de cards, botões, seções e interações.

O Codex deve usar este documento como **fonte de verdade visual** para qualquer nova página pública ou comercial do Bigood.

---

# 1. Contexto da Marca

## Nome

**Bigood**

O nome remete a:

- **Bigode**: conexão direta com barbearias.
- **Big**: crescimento, escala e profissionalização.
- **Good**: qualidade, confiança e resultado.

## Slogan principal

**Cabelo, barba e gestão para o seu negócio crescer.**

## Posicionamento visual

O Bigood deve parecer uma plataforma SaaS premium para barbearias modernas.

A landing page não deve parecer um site genérico de sistema.  
Ela deve transmitir:

- Gestão profissional.
- Crescimento para barbearias.
- Tecnologia moderna.
- Confiança.
- Organização.
- Visual de alto padrão.
- Experiência comercial clara.

## Sensação desejada

A interface deve parecer:

- Premium.
- Limpa.
- Robusta.
- Moderna.
- Comercial.
- Responsiva.
- Elegante.
- Fácil de entender.

Evitar:

- Visual infantil.
- Cores muito vibrantes em excesso.
- Cards gigantes no mobile.
- Contraste fraco.
- Layout poluído.
- Texto longo demais.
- Aparência de template genérico.

---

# 2. Stack Visual Recomendada

Usar o padrão atual do projeto:

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Hugeicons ou Lucide Icons**
- **Plus Jakarta Sans**
- **JetBrains Mono**, apenas para dados técnicos

O Codex deve priorizar componentes reutilizáveis e manter a landing modular.

Estrutura recomendada:

```txt
components/
  landing/
    landing-header.tsx
    landing-hero.tsx
    landing-section-pill.tsx
    landing-feature-card.tsx
    landing-plan-card.tsx
    landing-flow-card.tsx
    landing-faq.tsx
    landing-footer.tsx
    landing-cta-section.tsx

app/
  page.tsx
```

---

# 3. Paleta de Cores

## Cores principais

| Nome | Valor | Uso |
|---|---|---|
| Primary Dark | `#082F22` | Fundo premium, hero, seções de impacto |
| Primary | `#0B3324` | Texto forte, títulos, elementos principais |
| Accent Lime | `#A3E635` | CTA principal, destaques, badges positivos |
| Surface | `#F8FAFC` | Fundo claro principal |
| Card | `#FFFFFF` | Cards e blocos |
| Muted | `#64748B` | Texto secundário |
| Border | `#E2E8F0` | Bordas suaves |
| Soft Green | `rgba(8, 47, 34, 0.06)` | Fundos sutis e pills |
| Lime Soft | `rgba(163, 230, 53, 0.16)` | Realces suaves |

---

# 4. Tokens CSS Obrigatórios

Criar ou manter estes tokens no `globals.css`.

```css
:root {
  --landing-bg: #F8FAFC;
  --landing-card: #FFFFFF;
  --landing-card-soft: #F3F7F2;

  --landing-primary-dark: #082F22;
  --landing-primary: #0B3324;
  --landing-primary-soft: rgba(8, 47, 34, 0.06);

  --landing-accent: #A3E635;
  --landing-accent-soft: rgba(163, 230, 53, 0.16);

  --landing-muted: #64748B;
  --landing-border: rgba(8, 47, 34, 0.12);

  --landing-white: #FFFFFF;

  --landing-shadow-soft: 0 18px 50px rgba(8, 47, 34, 0.08);
  --landing-shadow-medium: 0 24px 70px rgba(8, 47, 34, 0.14);
  --landing-shadow-lime: 0 16px 36px rgba(163, 230, 53, 0.24);

  --landing-radius-sm: 12px;
  --landing-radius-md: 18px;
  --landing-radius-lg: 24px;
  --landing-radius-xl: 32px;
  --landing-radius-full: 9999px;
}
```

Também pode manter compatibilidade com OKLCH:

```css
:root {
  --background: oklch(0.9842 0.0034 247.8575);
  --foreground: oklch(0.235 0.055 145);
  --primary: oklch(0.857 0.1698 134.5554);
  --primary-dark: oklch(0.2869 0.0839 135.0504);
  --border: oklch(0.9288 0.0126 255.5078);
  --accent: oklch(0.857 0.1698 134.5554);
}
```

---

# 5. Tipografia

## Fonte principal

Usar **Plus Jakarta Sans** em toda a landing.

Aplicar em:

- Títulos.
- Botões.
- Textos.
- Cards.
- Navegação.
- Labels.
- Badges.

## Fonte secundária

Usar **JetBrains Mono** somente em:

- Métricas técnicas.
- Códigos.
- IDs.
- Dados operacionais.
- Pequenas etiquetas de status.

Não usar JetBrains Mono em títulos comerciais.

---

# 6. Escala Tipográfica

## Desktop

| Elemento | Tamanho | Peso | Tracking | Line-height |
|---|---:|---:|---:|---:|
| Hero H1 | `clamp(48px, 6vw, 76px)` | 900 | `-0.06em` | `0.95` |
| Section H2 | `clamp(32px, 4vw, 52px)` | 800 | `-0.04em` | `1.05` |
| Card Title | `24px` a `34px` | 800 | `-0.03em` | `1.1` |
| Body Large | `18px` | 500 | normal | `1.7` |
| Body | `16px` | 500 | normal | `1.7` |
| Small | `14px` | 600 | normal | `1.5` |
| Microcopy | `12px` | 700 | `0.05em` | `1.4` |

## Mobile

| Elemento | Tamanho |
|---|---:|
| Hero H1 | `40px` a `44px` |
| Section H2 | `30px` a `34px` |
| Card Title | `22px` a `28px` |
| Body | `15px` a `16px` |
| Small | `13px` a `14px` |

## Regras

- Títulos devem ser fortes e compactos.
- Usar tracking negativo em títulos grandes.
- Evitar parágrafos longos.
- Texto secundário sempre em `--landing-muted`.
- Texto principal sempre em `--landing-primary` ou `--landing-primary-dark`.

---

# 7. Layout Geral da Landing Page

A landing deve seguir uma estrutura vertical com seções bem separadas.

Ordem recomendada:

```txt
1. Header
2. Hero
3. Faixa de confiança / métricas rápidas
4. Problemas da barbearia
5. Funcionalidades principais
6. Fluxo comercial
7. Prévia do produto / dashboard
8. Planos
9. FAQ
10. CTA final
11. Footer
```

---

# 8. Header da Landing

## Objetivo

O header deve funcionar como entrada comercial para:

- Visitante novo.
- Barbeiro que quer conhecer o produto.
- Barbeiro que quer entrar no sistema.
- Barbeiro que quer assinar plano.

## Estrutura desktop

```txt
[Logo Bigood] [Produto] [Funcionalidades] [Planos] [FAQ]         [Entrar] [Assinar plano]
```

## Estrutura mobile

```txt
[Logo Bigood]                         [Menu]
```

Ao abrir menu:

```txt
Produto
Funcionalidades
Planos
FAQ
Entrar
Assinar plano
```

## Estilo visual

```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(248, 250, 252, 0.82);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--landing-border);
}
```

## Botão "Entrar"

Estilo secundário:

```css
background: #FFFFFF;
color: var(--landing-primary);
border: 1px solid var(--landing-border);
border-radius: 9999px;
```

## Botão "Assinar plano"

Estilo primário:

```css
background: var(--landing-accent);
color: var(--landing-primary-dark);
border-radius: 9999px;
box-shadow: var(--landing-shadow-lime);
```

## Regra de fluxo

Se o usuário clicar em **Assinar plano** sem cadastro:

1. Levar para cadastro.
2. Após cadastro, levar para escolha/checkout do plano.
3. Só liberar dashboard com assinatura ativa.

---

# 9. Hero Section

## Objetivo

A primeira dobra deve explicar claramente:

- O que é o Bigood.
- Para quem é.
- Qual problema resolve.
- Qual ação principal o usuário deve tomar.

## Estrutura

```txt
[Section Pill]
Título grande
Subtítulo
CTAs
Métricas rápidas
Imagem/foto premium da barbearia ou mockup do sistema
```

## Conteúdo sugerido

### Pill

```txt
Sistema de gestão para barbearias
```

### H1

```txt
Cabelo, barba e gestão para o seu negócio crescer.
```

### Subtítulo

```txt
Agenda, clientes, caixa, financeiro, profissionais, serviços, planos e assinaturas em um único painel para barbearias que querem crescer com controle.
```

### CTAs

```txt
Assinar plano
Entrar no sistema
```

## Estilo do Hero

O hero pode usar fundo claro ou fundo verde profundo.

### Versão recomendada

- Fundo com verde profundo.
- Texto branco.
- CTA lime.
- Imagem de barbearia real com overlay escuro.
- Cards flutuantes com métricas.

```css
.hero {
  background:
    radial-gradient(circle at top left, rgba(163, 230, 53, 0.16), transparent 32%),
    linear-gradient(135deg, #082F22 0%, #0B3324 100%);
  color: #FFFFFF;
}
```

## Imagem do Hero

Usar foto real de barbearia com:

- Cadeira de couro.
- Ambiente escuro/premium.
- Luz quente.
- Ferramentas de barbearia.
- Barbeiro em ação.

Aplicar overlay:

```css
.imageOverlay {
  background: linear-gradient(
    180deg,
    rgba(8, 47, 34, 0.1),
    rgba(8, 47, 34, 0.72)
  );
}
```

## Cards flutuantes

Exemplos:

```txt
+32% mais agendamentos
R$ 8.420 faturados no mês
128 clientes ativos
Agenda online 24h
```

Visual:

```css
.floating-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.16);
}
```

---

# 10. Section Pill

Usar em todas as seções principais.

## Exemplo

```tsx
<span className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-primary-soft)] px-[14px] py-2 text-sm font-bold text-[var(--landing-primary)]">
  Planos
</span>
```

## Regras

- Sempre antes do título da seção.
- Texto curto.
- Pode usar ícone pequeno.
- Não usar textos longos.
- Deve parecer um carimbo premium.

---

# 11. Botões da Landing

## Botão primário

Uso:

- Assinar plano.
- Começar agora.
- Criar conta.
- Falar com especialista.
- Confirmar interesse.

Classes sugeridas:

```tsx
className="
  inline-flex items-center justify-center gap-2
  rounded-full
  bg-[var(--landing-accent)]
  px-6 py-3
  text-sm font-extrabold
  text-[var(--landing-primary-dark)]
  shadow-[var(--landing-shadow-lime)]
  transition-all duration-300
  hover:brightness-105
  active:scale-95
"
```

## Botão secundário

Uso:

- Entrar.
- Ver planos.
- Conhecer recursos.
- Ver demonstração.

Classes sugeridas:

```tsx
className="
  inline-flex items-center justify-center gap-2
  rounded-full
  border border-[var(--landing-border)]
  bg-white
  px-6 py-3
  text-sm font-bold
  text-[var(--landing-primary)]
  shadow-sm
  transition-all duration-300
  hover:bg-[var(--landing-primary-soft)]
  active:scale-95
"
```

## Botão ghost em fundo escuro

```tsx
className="
  inline-flex items-center justify-center gap-2
  rounded-full
  border border-white/20
  bg-white/10
  px-6 py-3
  text-sm font-bold
  text-white
  backdrop-blur-md
  transition-all duration-300
  hover:bg-white/16
  active:scale-95
"
```

---

# 12. Cards

## Card padrão

Uso:

- Funcionalidades.
- Problemas.
- Benefícios.
- Resumos.

```tsx
className="
  rounded-[28px]
  border border-[var(--landing-border)]
  bg-white
  p-6
  shadow-[var(--landing-shadow-soft)]
"
```

## Card premium

Uso:

- Plano destacado.
- CTA.
- Bloco de prova de valor.
- Destaques comerciais.

```tsx
className="
  relative overflow-hidden
  rounded-[32px]
  border border-white/20
  bg-white/90
  p-8
  shadow-[var(--landing-shadow-medium)]
  backdrop-blur-xl
"
```

## Card escuro

Uso:

- CTA final.
- Plano personalizado.
- Blocos institucionais.

```tsx
className="
  rounded-[32px]
  border border-white/10
  bg-[var(--landing-primary-dark)]
  p-8
  text-white
  shadow-[var(--landing-shadow-medium)]
"
```

---

# 13. Seção de Métricas / Confiança

## Objetivo

Mostrar resultado e credibilidade de forma rápida.

## Estrutura

```txt
[Card métrica] [Card métrica] [Card métrica] [Card métrica]
```

## Exemplos

```txt
Agenda online 24h
Controle de caixa
Planos e recorrência
Até 3 unidades no Pro
```

## Estilo

- Cards pequenos.
- Ícones em lime.
- Texto direto.
- Fundo branco.
- Borda suave.

```tsx
className="
  rounded-[24px]
  border border-[var(--landing-border)]
  bg-white
  p-5
  shadow-[var(--landing-shadow-soft)]
"
```

---

# 14. Seção de Problemas

## Objetivo

Mostrar dores reais das barbearias antes de apresentar solução.

## Título sugerido

```txt
Sua barbearia não precisa depender de planilha, mensagem solta e controle manual.
```

## Cards de problema

Exemplos:

```txt
Agenda desorganizada
Horários perdidos, remarcações manuais e clientes dependendo de mensagens para confirmar atendimento.

Caixa sem controle
Comandas, pagamentos e fechamentos espalhados dificultam a visão real do faturamento.

Clientes sem recorrência
Sem planos e histórico, a barbearia perde previsibilidade e recompra.
```

## Estilo dos cards

- Fundo branco.
- Número grande translúcido no canto.
- Ícone em círculo lime ou verde claro.
- Título forte.
- Texto cinza.

```tsx
className="
  relative overflow-hidden
  rounded-[32px]
  border border-[var(--landing-border)]
  bg-white
  p-7
  shadow-[var(--landing-shadow-soft)]
"
```

Número decorativo:

```tsx
<span className="absolute right-6 bottom-5 text-[34px] font-black text-[rgba(11,51,36,0.08)]">
  01
</span>
```

---

# 15. Seção de Funcionalidades

## Objetivo

Apresentar os principais módulos do Bigood.

## Título sugerido

```txt
Tudo que sua barbearia precisa em um único painel.
```

## Funcionalidades principais

Criar cards para:

1. Agenda online.
2. Portal do cliente.
3. Gestão de clientes.
4. Caixa e comandas.
5. Financeiro.
6. Planos e assinaturas.
7. Profissionais e serviços.
8. Multiunidades.
9. Relatórios.
10. Configurações da empresa.

## Card de funcionalidade

```tsx
className="
  group
  rounded-[28px]
  border border-[var(--landing-border)]
  bg-white
  p-6
  shadow-[var(--landing-shadow-soft)]
  transition-all duration-300
  hover:-translate-y-1
  hover:shadow-[var(--landing-shadow-medium)]
"
```

Ícone:

```tsx
className="
  grid size-12 place-items-center
  rounded-2xl
  bg-[var(--landing-primary-soft)]
  text-[var(--landing-primary)]
  group-hover:bg-[var(--landing-accent)]
  group-hover:text-[var(--landing-primary-dark)]
  transition-all duration-300
"
```

---

# 16. Seção de Fluxo Comercial

## Objetivo

Explicar o fluxo do visitante até o dashboard.

## Título sugerido

```txt
Da escolha do plano ao painel, sem etapas soltas.
```

## Subtítulo sugerido

```txt
A landing funciona como porta de entrada comercial do SaaS: apresenta, converte, coleta os dados, confirma o plano e entrega o acesso.
```

## Etapas

```txt
01 — Escolha o plano
O barbeiro compara Mensal, Anual e Personalizado e entra no cadastro com o plano selecionado.

02 — Crie sua conta
O cadastro cria o acesso inicial da barbearia.

03 — Confirme a assinatura
Após escolher o plano, o pagamento ativa o acesso ao painel.

04 — Acesse o dashboard
Com assinatura ativa, o barbeiro entra no sistema e configura a operação.
```

## Layout

Usar carousel horizontal ou grid responsivo.

Card de fluxo:

```tsx
className="
  grid w-[min(86vw,760px)] shrink-0
  overflow-hidden
  rounded-[28px]
  border border-[var(--landing-border)]
  bg-[var(--landing-card-soft)]
  md:grid-cols-[0.9fr_1.1fr]
"
```

Imagem lateral:

```tsx
className="
  relative min-h-[360px]
  overflow-hidden
  bg-[var(--landing-primary-dark)]
"
```

Número grande:

```tsx
className="
  absolute right-5 bottom-5
  text-[86px]
  leading-none
  font-black
  tracking-[-0.08em]
  text-white/16
"
```

---

# 17. Seção de Prévia do Produto

## Objetivo

Mostrar que o Bigood é um sistema real, completo e profissional.

## Conteúdo

Pode exibir mockups de:

- Dashboard.
- Agenda.
- Clientes.
- Financeiro.
- Planos.
- Agendamentos.

## Estilo

- Moldura arredondada.
- Fundo verde escuro.
- Cards internos claros.
- Sombra forte.
- Aparência de produto SaaS.

```tsx
className="
  rounded-[36px]
  border border-[var(--landing-border)]
  bg-white
  p-3
  shadow-[0_30px_100px_rgba(8,47,34,0.18)]
"
```

---

# 18. Seção de Planos

## Objetivo

Converter o visitante.

## Título sugerido

```txt
Planos simples para barbearias que querem crescer com controle.
```

## Subtítulo sugerido

```txt
O Plano Pro cobre até 3 unidades. Operações com 4 ou mais unidades entram no Plano Personalizado.
```

## Planos

### Pro Mensal

Preço:

```txt
R$ 220/mês
```

Descrição:

```txt
Para barbearias que querem começar com uma gestão profissional sem compromisso anual.
```

Inclui:

```txt
Até 3 unidades
Agenda online
Portal do cliente
Gestão de clientes
Caixa e comandas
Financeiro
Planos e assinaturas
Gestão de profissionais e serviços
Suporte padrão
```

CTA:

```txt
Assinar mensal
```

---

### Pro Anual

Preço:

```txt
R$ 2.100/ano
```

Complemento:

```txt
Equivalente a R$ 175 por mês
```

Descrição:

```txt
A melhor opção para economizar, ter mais flexibilidade de pagamento e migrar sem custo adicional.
```

Destaques:

```txt
Tudo do Plano Pro
Até 3 unidades
Economia de R$ 540 por ano
Transição de sistema grátis
Outras formas de pagamento disponíveis
```

CTA:

```txt
Assinar anual
```

Badge:

```txt
Mais recomendado
```

Este card deve ser o mais destacado.

---

### Personalizado

Descrição:

```txt
Para operações com mais de 3 unidades, necessidades especiais, contrato personalizado ou limites maiores.
```

Inclui:

```txt
4 ou mais unidades
Condições comerciais sob medida
Atendimento consultivo
Contratos personalizados
Configuração avançada
Suporte prioritário
```

CTA:

```txt
Falar conosco
```

## Estilo dos cards de plano

Card comum:

```tsx
className="
  rounded-[32px]
  border border-[var(--landing-border)]
  bg-white
  p-7
  shadow-[var(--landing-shadow-soft)]
"
```

Card recomendado:

```tsx
className="
  relative overflow-hidden
  rounded-[32px]
  border border-[rgba(163,230,53,0.55)]
  bg-[var(--landing-primary-dark)]
  p-7
  text-white
  shadow-[0_28px_90px_rgba(8,47,34,0.28)]
"
```

Badge recomendado:

```tsx
className="
  inline-flex items-center rounded-full
  bg-[var(--landing-accent)]
  px-3 py-1
  text-xs font-black
  text-[var(--landing-primary-dark)]
"
```

---

# 19. FAQ

## Objetivo

Reduzir dúvidas antes da conversão.

## Perguntas sugeridas

```txt
Preciso cadastrar a barbearia antes de assinar?
Sim. O cadastro cria sua conta e depois você escolhe ou confirma o plano.

O dashboard é liberado logo após o cadastro?
Não. O acesso ao dashboard completo é liberado após assinatura ativa.

O Plano Pro serve para mais de uma unidade?
Sim. O Plano Pro cobre até 3 unidades.

Tenho mais de 3 unidades. Qual plano devo escolher?
Nesse caso, escolha o Plano Personalizado e fale com a equipe.

O plano anual tem benefício?
Sim. O plano anual sai equivalente a R$ 175 por mês e inclui transição de sistema grátis.

Posso pagar o anual de outras formas?
Sim. O plano anual pode aceitar outras formas de pagamento, conforme aprovação.
```

## Estilo

Usar accordion do shadcn/ui.

```tsx
className="
  rounded-[24px]
  border border-[var(--landing-border)]
  bg-white
  px-5
  shadow-[var(--landing-shadow-soft)]
"
```

---

# 20. CTA Final

## Objetivo

Fechar a landing com uma chamada forte para conversão.

## Título sugerido

```txt
Sua barbearia pronta para crescer com mais controle.
```

## Subtítulo sugerido

```txt
Comece com o Plano Pro ou fale conosco para montar uma operação personalizada.
```

## CTAs

```txt
Assinar plano
Falar conosco
```

## Estilo

Usar fundo verde profundo com detalhes lime.

```tsx
className="
  relative overflow-hidden
  rounded-[40px]
  bg-[var(--landing-primary-dark)]
  px-6 py-16
  text-center
  text-white
  shadow-[0_30px_100px_rgba(8,47,34,0.24)]
"
```

Adicionar gradiente decorativo:

```tsx
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.22),transparent_38%)]" />
```

---

# 21. Footer

## Estrutura

```txt
Logo Bigood
Descrição curta
Links
Contato
Copyright
```

## Descrição

```txt
Sistema de gestão para barbearias com agenda, clientes, caixa, financeiro, planos e recorrência.
```

## Links

```txt
Produto
Funcionalidades
Planos
FAQ
Entrar
Assinar plano
```

## Estilo

```tsx
className="
  border-t border-[var(--landing-border)]
  bg-[var(--landing-bg)]
  py-10
  text-[var(--landing-muted)]
"
```

---

# 22. Responsividade

## Desktop

- Container máximo: `1280px`.
- Grid com 2 ou 3 colunas.
- Hero em 2 colunas.
- Cards grandes e bem espaçados.
- Imagens com presença visual forte.

## Tablet

- Reduzir espaçamentos.
- Grids de 2 colunas.
- Hero pode manter 2 colunas se houver espaço.

## Mobile

A landing deve parecer um app mobile premium.

Regras:

- Header compacto.
- Hero em uma coluna.
- Título menor.
- CTAs em largura total.
- Cards em uma coluna.
- Planos empilhados.
- Evitar textos longos.
- Reduzir padding.
- Evitar cards altos demais.
- Priorizar toque confortável.

Classes úteis:

```tsx
className="
  px-4
  sm:px-6
  lg:px-8
"
```

```tsx
className="
  grid gap-5
  md:grid-cols-2
  lg:grid-cols-3
"
```

---

# 23. Espaçamento

## Seções

Desktop:

```txt
padding-top: 96px
padding-bottom: 96px
```

Mobile:

```txt
padding-top: 64px
padding-bottom: 64px
```

Tailwind:

```tsx
className="py-16 md:py-24"
```

## Container

```tsx
className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
```

## Gaps

```txt
Pequeno: 12px
Médio: 24px
Grande: 48px
Extra: 64px
```

---

# 24. Bordas e Radius

Usar bordas bem arredondadas.

| Elemento | Radius |
|---|---:|
| Botão | `9999px` |
| Badge/Pill | `9999px` |
| Card pequeno | `20px` |
| Card médio | `24px` |
| Card grande | `32px` |
| Bloco hero/CTA | `36px` a `40px` |

Evitar cantos retos.

---

# 25. Sombras

As sombras devem ser suaves e premium.

```css
--landing-shadow-soft: 0 18px 50px rgba(8, 47, 34, 0.08);
--landing-shadow-medium: 0 24px 70px rgba(8, 47, 34, 0.14);
--landing-shadow-lime: 0 16px 36px rgba(163, 230, 53, 0.24);
```

Não usar sombras pretas muito fortes em fundos claros.

---

# 26. Ícones

## Biblioteca

Preferencial:

```txt
Hugeicons
```

Alternativa:

```txt
Lucide Icons
```

## Estilo

- Outline.
- Stroke entre `1.5px` e `2px`.
- Ícones sempre acompanhados de texto.
- Não usar ícone sozinho em ação importante.
- Ícones de destaque podem usar lime.

## Tamanho

```txt
Ícone pequeno: 16px
Ícone médio: 20px
Ícone grande: 24px
Ícone dentro de card: 24px a 28px
```

---

# 27. Motion

## Regra geral

Movimento deve ser sutil, sem exagero.

## Transição padrão

```css
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Interações

Botão:

```txt
hover: brilho leve
active: scale(0.95)
```

Card:

```txt
hover: translateY(-4px)
hover: sombra mais forte
```

Entrada de seção:

```txt
fade + translateY(16px)
```

## Durações

| Interação | Duração |
|---|---:|
| Hover | 150ms a 250ms |
| Card hover | 300ms |
| Entrada de seção | 400ms a 600ms |
| Accordion | 250ms |

---

# 28. Regras para Criar Novas Páginas com o Mesmo Design

Quando o Codex criar uma nova página pública do Bigood, deve seguir estas regras:

## Estrutura obrigatória

Toda nova página deve ter:

```txt
Header
Hero interno
Conteúdo principal
CTA final
Footer
```

## Hero interno

Deve conter:

- Section Pill.
- H1 forte.
- Subtítulo curto.
- CTA se fizer sentido.
- Visual com card, mockup ou imagem.

## Padrão visual

Toda página deve usar:

- Fundo `--landing-bg`.
- Títulos em `--landing-primary-dark`.
- Texto secundário em `--landing-muted`.
- CTA principal lime.
- Cards brancos com borda suave.
- Radius grande.
- Sombra suave.
- Espaçamento generoso.

## Não criar

- Páginas com visual diferente da landing.
- Botões quadrados.
- Cards sem radius.
- Cores fora da paleta.
- Gradientes aleatórios.
- Fontes diferentes.
- Layout denso demais.
- Telas mobile quebradas.

---

# 29. Páginas que devem seguir este design

O Codex deve usar este design para criar:

```txt
/planos
/cadastro
/login
/agendar
/horarios
/agendamentos
/contato
/faq
/sobre
/termos
/privacidade
```

## Observação

Páginas operacionais, como dashboard interno, podem ser mais densas, mas ainda devem respeitar:

- Paleta.
- Tipografia.
- Radius.
- Cards.
- CTAs.
- Hierarquia.
- Clareza visual.

---

# 30. Checklist de Qualidade para o Codex

Antes de finalizar qualquer página, verificar:

- [ ] A página usa as variáveis `--landing-*`.
- [ ] O CTA principal usa lime.
- [ ] O fundo principal é claro ou verde profundo.
- [ ] Os cards têm radius grande.
- [ ] Os textos têm contraste suficiente.
- [ ] O mobile não quebra.
- [ ] Os botões têm altura confortável.
- [ ] As seções têm espaçamento generoso.
- [ ] Os ícones seguem estilo outline.
- [ ] A página parece parte do mesmo produto.
- [ ] Não há cores fora da paleta.
- [ ] Não há cards grandes demais no mobile.
- [ ] O layout não parece genérico.
- [ ] A página mantém aparência SaaS premium.

---

# 31. Prompt Base para o Codex

Use este prompt quando for pedir uma nova página:

```txt
Crie/refatore esta página seguindo fielmente o Design System da Landing Page do Bigood.

Mantenha a identidade visual:
- Verde profundo #082F22
- Verde lime #A3E635 para CTAs e destaques
- Fundo claro #F8FAFC
- Cards brancos com bordas suaves
- Radius grande entre 24px e 32px
- Botões arredondados estilo pill
- Tipografia Plus Jakarta Sans
- Estética SaaS premium para barbearias
- Componentes limpos, modernos e responsivos
- Mobile com aparência de app, sem cards gigantes e sem textos quebrados

Use Tailwind CSS, shadcn/ui e componentes reutilizáveis.

A página deve parecer continuação natural da landing page atual do Bigood, sem alterar a identidade visual.
```

---

# 32. Prompt para Refatorar uma Página Quebrada

```txt
Refatore totalmente esta página para seguir o Design System da Landing Page do Bigood.

Corrija:
- Responsividade mobile
- Contraste de cores
- Cards grandes demais
- Espaçamentos inconsistentes
- Componentes fora do padrão
- Botões que não seguem o estilo pill
- Textos com hierarquia fraca
- Layout com aparência genérica

Mantenha:
- Verde profundo #082F22
- Lime #A3E635 nos CTAs
- Fundo #F8FAFC
- Cards brancos arredondados
- SectionPills
- Sombras suaves
- Tipografia forte
- Experiência premium e moderna
```

---

# 33. Resumo Visual Final

A landing do Bigood deve ser:

```txt
Premium
Clara
Verde profunda
Com lime nos CTAs
Cards arredondados
Tipografia forte
Fotografia de barbearia real
SaaS moderno
Mobile com cara de app
Conversão direta para planos
```

O Codex deve sempre preservar essa linguagem visual ao criar novas páginas.