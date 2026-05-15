# AbacatePay - Design System Extraido

## Objetivo

Este documento registra os principais padroes visuais observados no site publico da AbacatePay em 13/05/2026.

Fonte analisada:

- https://www.abacatepay.com/
- https://www.abacatepay.com/pricing
- https://www.abacatepay.com/pix
- https://www.abacatepay.com/card
- https://www.abacatepay.com/assinaturas
- https://www.abacatepay.com/why

Uso recomendado no Bigood: referencia visual externa. Nao substituir o design system atual do Bigood sem autorizacao explicita.

---

## 1. Personalidade Visual

A identidade combina:

- SaaS financeiro leve.
- Produto feito para desenvolvedores.
- Linguagem visual amigavel, mas tecnica.
- Interface limpa, com muito branco e linhas finas.
- Verde-lima como sinal de acao, crescimento e dinheiro.
- Estrutura em paineis modulares, com separadores de 1px.
- Mockups de produto como principal prova visual.

A sensacao geral e: simples, rapido, direto, acessivel e moderno.

---

## 2. Paleta de Cores

### Cores principais

| Papel | Cor | Uso observado |
| --- | --- | --- |
| Texto principal escuro | `#244C4E` | Navegacao, botoes, corpo principal, icones |
| Titulo escuro | `#204749` | Headlines grandes e titulos de secao |
| Texto secundario | `#4C5267` | Paragrafos, descricoes e textos auxiliares |
| CTA verde-lima | `#9EEA6C` | Botoes primarios, badges, indicadores positivos |
| Destaque verde vivo | `#58C411` | Palavra destacada no hero, links e acentos |
| Fundo divisorio | `#E2E7F1` | Fundo da pagina, bordas e linhas de separacao |
| Fundo neutro claro | `#F6F8FA` | Areas internas, hover de nav, mockups e chips |
| Verde suave | `#E6F9DA` | Fundos de icones e estados positivos |
| Branco | `#FFFFFF` | Cards, secoes, header e superficies |
| Texto forte quase preto | `#121217` | Numeros, metricas e alguns textos de UI |

### Cores de marca no logo

| Cor | Uso |
| --- | --- |
| `#337D63` | Contorno/folha escura |
| `#89BA4F` | Verde medio |
| `#9EEA6C` | Verde claro |
| `#804B35` | Caroco/marrom |

### Gradiente principal

Usado no hero como brilho na base:

```css
background:
  radial-gradient(
    200% 300% at -30% -60%,
    hsla(0, 0%, 100%, 0) 56.43%,
    #c2fa11 70.92%,
    #33bd19 100%
  ),
  #fff;
```

Padrao visual: topo branco, base verde-lima intensa, com transicao radial suave.

---

## 3. Tipografia

### Fontes carregadas

| Fonte | Uso observado |
| --- | --- |
| Fustat | Fonte principal da landing e navegacao |
| Inter Tight | Textos auxiliares, paragrafos e descricoes |
| Inter | Fonte auxiliar do sistema |
| Onest | Fonte auxiliar carregada |
| Monospace | Badges tecnicos, codigos e pequenos elementos de developer experience |

### Escala tipografica

| Elemento | Tamanho | Peso | Linha | Observacao |
| --- | --- | --- | --- | --- |
| Hero H1 desktop | `68px` | `600` | `105%` | Tracking apertado |
| Hero H1 mobile/tablet | `56px` | `600` | `105%` | Forte e compacto |
| H2 principal | `48px` | `600` | `120%` a `140%` | Usado em secoes |
| H2 mobile | `32px` | `600` | `120%` | Mantem presenca sem quebrar layout |
| Paragrafo destaque | `18px` | `500` | `180%` | Inter Tight |
| Nav/Button | `16px` | `600` | `11px` a `20px` | Fustat |
| Card title | `20px` | `600` | `14px` a `20px` | Compacto |
| Microcopy | `12px` a `14px` | `500` a `700` | `8px` a `10px` | Badges e metadados |

Principio: titulos grandes com line-height curto; textos descritivos com line-height amplo.

---

## 4. Layout

### Estrutura geral

O site usa uma moldura visual composta por:

- Fundo global em `#E2E7F1`.
- Secoes brancas arredondadas.
- Gap de `1px` entre header, hero e blocos.
- Colunas laterais com padrao listrado.
- Conteudo central com largura maxima.

Tokens observados:

```css
.content-center {
  max-width: 1200px;
}

@media (min-width: 1698px) {
  .content-center {
    max-width: 1520px;
  }
}

.content-side {
  min-width: 88px;
  background-color: #fff;
  overflow: hidden;
}
```

### Padrao de listras

```css
background:
  repeating-linear-gradient(
    45deg,
    rgba(226, 231, 241, 0.8) 0 1px,
    transparent 1px 14px
  );
background-color: #fff;
```

Uso: laterais do layout e areas decorativas discretas.

### Breakpoints encontrados

| Breakpoint | Uso provavel |
| --- | --- |
| `390px` | Mobile pequeno |
| `640px` | Mobile largo |
| `48rem` / `768px` | Tablet |
| `769px` / `810px` | Ajustes especificos de tablet |
| `1025px` | Desktop inicial |
| `1280px` | Desktop medio |
| `1440px` | Desktop grande |
| `1698px` | Desktop extra largo |

---

## 5. Componentes

### Header

Caracteristicas:

- Fundo branco.
- Cantos inferiores arredondados.
- Padding `24px` no desktop comum e `32px` em tablet+.
- Logo pequeno a esquerda.
- Navegacao horizontal central/direita.
- Separador vertical fino antes do CTA.
- CTA primario em formato pill.

Links de navegacao:

```css
font-size: 16px;
font-weight: 600;
padding: 12px 16px;
border-radius: 9999px;
color: #244C4E;
transition: all 300ms;
```

Hover:

- Fundo `#F6F8FA`.
- Escala aproximada `102%`.

### Botao primario

```css
background: #9EEA6C;
color: #244C4E;
border-radius: 9999px;
padding: 12px 16px;
font-size: 16px;
font-weight: 600;
transition: all 300ms;
```

Hover:

```css
background: #244C4E;
color: #9EEA6C;
```

Padrao: sempre com icone de seta quando e acao principal.

### Botao secundario

```css
background: #fff;
color: #244C4E;
border-radius: 9999px;
padding: 12px 16px;
```

Hover igual ao primario invertido:

```css
background: #244C4E;
color: #9EEA6C;
```

### Badges / Pills

Padrao:

- Bordas finas em `#E2E7F1`.
- Radius total.
- Padding compacto.
- Fonte pequena e bold.
- Pode incluir avatares sobrepostos.

Exemplo estrutural:

```css
border: 1px solid #E2E7F1;
border-radius: 9999px;
padding: 8px;
font-size: 12px;
font-weight: 700;
```

### Cards de features

Caracteristicas:

- Superficie branca.
- Separadores verticais tracejados/finos.
- Acento vertical verde na parte superior.
- Icone pequeno em verde escuro.
- Titulo em `#244C4E`.
- Descricao em `#4C5267`.
- Muito espaco interno.

Padrao visual: cards parecem colunas dentro de uma grade, nao cards soltos com sombra.

### Mockups de produto

Padrao:

- Dashboard desktop grande ao fundo.
- Tela mobile sobreposta a frente.
- Moldura branca espessa.
- Radius entre `16px` e `24px`.
- Sombra suave:

```css
box-shadow: 0px 7px 29px 0px rgba(100, 100, 111, 0.2);
```

Uso: prova visual do produto no hero, ocupando a lateral direita.

### Floating action button

Observado no canto inferior direito:

- Circulo verde `#9EEA6C`.
- Sombra suave.
- Icone branco central.
- Tamanho grande para contato/suporte.

---

## 6. Bordas, Radius e Sombras

### Radius

| Elemento | Radius |
| --- | --- |
| Botoes e pills | `9999px` |
| Secoes principais | `8px` aproximado |
| Mockups/cards visuais | `16px` a `24px` |
| Badges pequenos | `4px` a `9999px`, conforme contexto |

### Bordas

Padrao dominante:

```css
border: 1px solid #E2E7F1;
```

O layout usa borda e separacao de 1px mais do que sombra.

### Sombras

Sombras sao raras e usadas principalmente em mockups:

```css
0px 7px 29px rgba(100, 100, 111, 0.2)
```

---

## 7. Espacamento

### Ritmo observado

| Uso | Valor |
| --- | --- |
| Separacao entre blocos estruturais | `1px` |
| Padding header | `24px` a `32px` |
| Padding hero mobile/tablet | `24px` a `32px` |
| Padding hero desktop | `64px` a `104px` horizontal |
| Espaco antes de CTAs no hero | `64px` |
| Secoes grandes | `80px` a `120px` |
| Gap entre CTAs | `16px` |
| Gap entre icone e texto | `8px` a `12px` |

Principio: layout espaçoso, mas componentes internos compactos.

---

## 8. Interacao e Movimento

Padroes observados:

- Transicoes de `300ms` em botoes e links.
- Hover com mudanca de cor e leve scale.
- Animacoes AOS para entrada de secoes.
- Respeito a `prefers-reduced-motion`.
- Microinteracoes simples; nao ha excesso de animacao.

Tokens:

```css
transition-duration: 300ms;
hover: scale(1.02);
```

---

## 9. Iconografia e Imagem

### Icones

Estilo:

- Simples.
- Solidos ou outline minimalista.
- Tamanho comum entre `16px`, `20px` e `24px`.
- Cor principal `#204749` ou `#244C4E`.
- Fundos circulares verde claro para beneficios.

### Imagens

Tipos usados:

- Avatares pequenos em badges e depoimentos.
- Mockups de dashboard.
- Elementos de produto renderizados como SVG/ilustracao de interface.

Nao e um site baseado em fotos grandes; a prova visual vem do proprio produto.

---

## 10. Padrao de Conteudo

Tom:

- Direto.
- Informal moderado.
- Orientado a desenvolvedores.
- Promessa curta e objetiva.
- Frases curtas em CTAs.

Estrutura frequente:

1. Eyebrow ou badge.
2. Headline curta.
3. Subheadline objetiva.
4. Dois CTAs.
5. Prova visual ou prova social.
6. Cards de beneficios.
7. Comparador/precos/depoimentos/FAQ.

---

## 11. Receita de Recriacao

Para criar uma tela inspirada no sistema AbacatePay:

```tsx
<main className="min-h-screen bg-[#E2E7F1] text-[#244C4E] font-fustat space-y-px">
  <header className="flex gap-px">
    <aside className="hidden lg:block min-w-[88px] bg-white bg-stripes rounded-br-lg" />
    <div className="w-full max-w-[1200px] bg-white rounded-b-lg px-6 py-6">
      {/* logo, nav, cta */}
    </div>
    <aside className="hidden lg:block min-w-[88px] bg-white bg-stripes rounded-bl-lg" />
  </header>

  <section className="flex gap-px">
    <aside className="hidden lg:block min-w-[88px] bg-white rounded-r-lg" />
    <div className="w-full max-w-[1200px] rounded-lg bg-white overflow-hidden">
      <div className="hero-gradient grid lg:grid-cols-2 px-6 py-16 lg:px-16">
        {/* copy + ctas + mockup */}
      </div>
    </div>
    <aside className="hidden lg:block min-w-[88px] bg-white rounded-l-lg" />
  </section>
</main>
```

CSS auxiliar:

```css
.bg-stripes {
  background:
    repeating-linear-gradient(
      45deg,
      rgba(226, 231, 241, 0.8) 0 1px,
      transparent 1px 14px
    );
  background-color: #fff;
}

.hero-gradient {
  background:
    radial-gradient(
      200% 300% at -30% -60%,
      hsla(0, 0%, 100%, 0) 56.43%,
      #c2fa11 70.92%,
      #33bd19 100%
    ),
    #fff;
}
```

---

## 12. Cuidados ao Aplicar no Bigood

Nao copiar diretamente para a landing atual do Bigood sem decisao de produto, porque:

- O Bigood ja possui identidade visual aprovada.
- A AbacatePay usa verde-lima forte como identidade central.
- O tom visual e mais developer/fintech do que barbearia/SaaS premium.
- O padrao de CTA publico da AbacatePay inclui autoacesso, enquanto o Bigood deve manter fluxo consultivo.

Uso seguro:

- Aproveitar a estrutura de documentacao visual.
- Inspirar separadores de 1px, mockups e cards modulares.
- Estudar o uso de prova visual de produto.
- Adaptar apenas com tokens do Bigood, se houver autorizacao.

