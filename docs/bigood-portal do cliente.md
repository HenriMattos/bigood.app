# Bigood — Portal Mobile do Cliente para Agendamento

## Objetivo

Criar do zero a página mobile onde o cliente da barbearia acessa o portal público da barbearia, visualiza informações principais, vê serviços disponíveis, acompanha agendamentos, gerencia perfil, assina planos e realiza checkout.

A inspiração de disposição vem das imagens de referência, mas o estilo visual deve seguir 100% o Design System do Bigood.

Ignorar as cores e estilo das imagens de referência.  
Usar apenas como base de composição mobile:

- Banner no topo.
- Logo circular sobreposta ao banner.
- Nome da barbearia.
- Slogan.
- Card de agendamento recente.
- Lista de serviços disponíveis.
- Botão principal de agendar.
- Navegação inferior flutuante fixa.
- Experiência mobile estilo app.

---

# 1. Direção Visual Obrigatória

Usar o design system do Bigood.

## Paleta

```css
--background: #F8FAFC;
--primary-dark: #082F22;
--primary: #0B3324;
--accent: #A3E635;
--card: #FFFFFF;
--muted: #64748B;
--border: rgba(8, 47, 34, 0.12);
--soft-green: rgba(8, 47, 34, 0.06);
--lime-soft: rgba(163, 230, 53, 0.16);
```

## Estilo

- Mobile-first.
- Aparência de app.
- Cards arredondados.
- Fundo claro.
- CTA lime.
- Tipografia forte.
- Ícones outline.
- Bottom navigation flutuante.
- Pouca informação por tela.
- Componentes compactos.
- Nada de layout desktop espremido.

## Tipografia

Usar `Plus Jakarta Sans`.

Hierarquia sugerida:

```txt
Nome da barbearia: 24px / 28px / 800
Slogan: 14px / 20px / 500
Título de seção: 17px / 22px / 800
Texto de card: 14px / 20px / 500
Microcopy: 12px / 16px / 600
Preço: 15px / 20px / 800
```

---

# 2. Estrutura Geral do Portal

Criar um portal público mobile para cada barbearia.

## Rota recomendada

```txt
/barbearia/[slug]
```

Exemplos:

```txt
/barbearia/urban-barbershop
/barbearia/navalha-premium
/barbearia/bigode-club
```

O `[slug]` deve vir da configuração feita no dashboard do barbeiro, na área de empresa.

---

# 3. Dados Personalizáveis pelo Dashboard do Barbeiro

A página deve consumir dados configuráveis da empresa/barbearia.

## Dados da empresa

```ts
type BarberCompany = {
  id: string;
  slug: string;
  name: string;
  slogan?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  openingHours?: string;
};
```

## O barbeiro deve conseguir personalizar no dashboard:

- URL pública da barbearia.
- Nome da barbearia.
- Slogan.
- Banner do portal.
- Logo circular.
- Descrição curta.
- Endereço.
- WhatsApp.
- Instagram.
- Horários de funcionamento.
- Serviços disponíveis.
- Planos disponíveis para os clientes.
- Benefícios de cada plano.

---

# 4. Estrutura de Arquivos Recomendada

Criar componentes separados para facilitar manutenção.

```txt
app/
  barbearia/
    [slug]/
      page.tsx

components/
  client-portal/
    client-portal-shell.tsx
    client-portal-header.tsx
    client-bottom-nav.tsx

    home-tab.tsx
    appointments-tab.tsx
    profile-tab.tsx
    plans-tab.tsx
    checkout-screen.tsx

    recent-appointment-card.tsx
    service-list.tsx
    service-card.tsx
    plan-current-card.tsx
    plan-carousel.tsx
    plan-subscription-card.tsx
    appointment-history-card.tsx
    profile-form.tsx

    booking-flow/
      booking-start.tsx
      booking-service-step.tsx
      booking-professional-step.tsx
      booking-date-step.tsx
      booking-time-step.tsx
      booking-confirm-step.tsx
```

---

# 5. Comportamento de Navegação

O portal deve funcionar como um mini app mobile com navegação por abas.

## Abas principais

```txt
Início
Agendamentos
Perfil
Planos
```

## Bottom navigation

A navegação inferior deve estar sempre visível, flutuando na parte inferior da tela.

Estilo inspirado na segunda imagem de referência, mas usando Bigood.

## Comportamento

- A aba ativa deve ficar destacada em verde escuro ou lime.
- O botão central pode ser o botão principal de agendar.
- Deve respeitar `safe-area-inset-bottom`.
- Deve ter fundo branco com blur.
- Deve ter sombra suave.
- Não pode cobrir conteúdo importante.

## Layout recomendado

```txt
[Início] [Agendamentos] [Agendar] [Planos] [Perfil]
```

O botão central “Agendar” deve ser circular ou pill destacado.

---

# 6. Shell Mobile

Criar um componente principal:

```tsx
<ClientPortalShell />
```

Responsabilidades:

- Carregar dados da barbearia pelo slug.
- Controlar aba ativa.
- Renderizar conteúdo da aba.
- Manter bottom navigation fixa.
- Controlar abertura do fluxo de agendamento.
- Controlar abertura da tela de checkout.

Estrutura:

```tsx
<ClientPortalShell>
  <ActiveTabContent />
  <ClientBottomNav />
</ClientPortalShell>
```

---

# 7. Layout Base Mobile

A tela deve ocupar toda a viewport.

```tsx
className="
  min-h-dvh
  bg-[#F8FAFC]
  text-[#0B3324]
  pb-[calc(96px+env(safe-area-inset-bottom))]
"
```

Container interno:

```tsx
className="
  mx-auto
  min-h-dvh
  w-full
  max-w-[430px]
  bg-[#F8FAFC]
"
```

O portal deve ser otimizado para telas entre:

```txt
320px até 430px
```

Em telas maiores, centralizar como mockup/app.

---

# 8. Tela Inicial — Início

A tela inicial deve conter somente o essencial.

## Ordem dos elementos

```txt
1. Banner da barbearia
2. Logo circular sobreposta
3. Nome da barbearia
4. Slogan
5. Card de agendamento mais recente
6. Seção de serviços disponíveis
7. Botão "Agendar agora"
8. Bottom navigation flutuante
```

---

# 9. Banner da Barbearia

## Comportamento

- Usar imagem configurada no dashboard.
- Se não houver imagem, usar fallback com gradiente verde Bigood.
- Altura mobile: entre `180px` e `220px`.
- Bordas inferiores arredondadas.
- Overlay escuro para melhorar contraste.

## Classe sugerida

```tsx
className="
  relative
  h-[210px]
  overflow-hidden
  rounded-b-[32px]
  bg-[#082F22]
"
```

## Overlay

```tsx
<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-[#082F22]/70" />
```

---

# 10. Logo Circular da Barbearia

## Posição

A logo deve ficar sobreposta ao banner, similar à referência.

```tsx
className="
  relative
  -mt-12
  ml-5
  size-24
  overflow-hidden
  rounded-full
  border-4
  border-[#F8FAFC]
  bg-white
  shadow-[0_18px_50px_rgba(8,47,34,0.18)]
"
```

## Fallback

Se não houver logo:

- Mostrar iniciais da barbearia.
- Fundo verde escuro.
- Texto lime.

---

# 11. Nome e Slogan

Logo abaixo da logo.

```tsx
<h1 className="px-5 pt-4 text-2xl font-black tracking-[-0.04em] text-[#0B3324]">
  Nome da Barbearia
</h1>

<p className="px-5 pt-1 text-sm font-medium text-[#64748B]">
  Slogan da barbearia
</p>
```

Fallback do slogan:

```txt
Cabelo, barba e cuidado no seu tempo.
```

---

# 12. Card de Agendamento Mais Recente

Substituir o carrossel de imagens da referência por um card mostrando o agendamento mais recente.

## Se houver agendamento recente

Mostrar:

- Status.
- Serviço.
- Data.
- Horário.
- Profissional.
- Botão pequeno “Ver detalhes”.
- Botão pequeno “Reagendar”, se aplicável.

## Se não houver agendamento recente

Mostrar empty state:

```txt
Você ainda não tem agendamentos.
Escolha um serviço e agende em poucos cliques.
```

CTA pequeno:

```txt
Agendar agora
```

## Layout

```tsx
className="
  mx-5
  mt-6
  rounded-[28px]
  border
  border-[rgba(8,47,34,0.12)]
  bg-white
  p-5
  shadow-[0_18px_50px_rgba(8,47,34,0.08)]
"
```

## Status

Usar badges:

```txt
Confirmado
Pendente
Finalizado
Cancelado
```

Cores:

- Confirmado: lime soft + verde escuro.
- Pendente: amarelo suave.
- Cancelado: vermelho suave.
- Finalizado: cinza suave.

---

# 13. Serviços Disponíveis

A seção deve mostrar os serviços disponíveis de acordo com o plano/assinatura da barbearia.

## Título

```txt
Serviços disponíveis
```

## Subtítulo opcional

```txt
Escolha um serviço para iniciar seu agendamento.
```

## Card de serviço

Cada serviço deve mostrar:

- Nome.
- Duração.
- Preço.
- Descrição curta opcional.
- Ícone ou pequeno marcador.
- Ao clicar, inicia fluxo de agendamento com o serviço pré-selecionado.

## Tipo

```ts
type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isAvailable: boolean;
};
```

## Visual

```tsx
className="
  flex
  items-center
  justify-between
  gap-4
  rounded-[22px]
  border
  border-[rgba(8,47,34,0.10)]
  bg-white
  p-4
  shadow-[0_10px_30px_rgba(8,47,34,0.05)]
  transition-all
  active:scale-[0.98]
"
```

## Exemplo de conteúdo

```txt
Corte Masculino
30min
R$ 60,00

Barba
20min
R$ 40,00

Corte + Barba
50min
R$ 90,00

Sobrancelha
15min
R$ 25,00
```

---

# 14. Botão Principal “Agendar Agora”

Na tela inicial deve haver um botão principal.

## Texto

```txt
Agendar agora
```

## Visual

```tsx
className="
  mx-5
  mt-6
  flex
  h-14
  items-center
  justify-center
  gap-2
  rounded-full
  bg-[#A3E635]
  text-sm
  font-black
  uppercase
  tracking-[0.02em]
  text-[#082F22]
  shadow-[0_16px_36px_rgba(163,230,53,0.24)]
  transition-all
  active:scale-95
"
```

## Comportamento

Ao clicar:

- Abrir fluxo de agendamento.
- Se cliente não estiver logado, pedir login/cadastro durante o fluxo, sem bloquear a tela inicial.
- Se serviço já foi selecionado, pular etapa de serviço.

---

# 15. Fluxo de Agendamento

Criar fluxo em tela cheia ou bottom sheet expandido.

## Etapas

```txt
1. Escolher serviço
2. Escolher profissional
3. Escolher data
4. Escolher horário
5. Confirmar dados
6. Concluir agendamento
```

## Regras

- O cliente deve conseguir voltar etapas.
- Sempre mostrar resumo do agendamento.
- O botão principal fica no rodapé da etapa.
- Mobile-first.
- Inputs grandes o suficiente para toque.

## Estado final

Após confirmar:

```txt
Agendamento confirmado!
```

Mostrar:

- Serviço.
- Profissional.
- Data.
- Horário.
- Valor.
- Botão “Ver meus agendamentos”.
- Botão “Agendar outro serviço”.

---

# 16. Tela de Agendamentos Feitos

A aba “Agendamentos” deve mostrar todo o histórico do cliente.

## Conteúdo

- Próximos agendamentos.
- Agendamentos passados.
- Cancelados.
- Finalizados.
- Pendentes.

## Filtros simples

Usar chips horizontais:

```txt
Todos
Próximos
Finalizados
Cancelados
```

## Card de agendamento

Mostrar:

- Status.
- Serviço.
- Profissional.
- Data.
- Horário.
- Valor.
- Unidade, se houver.
- Botão “Ver detalhes”.
- Botão “Reagendar”.

## Visual

```tsx
className="
  rounded-[26px]
  border
  border-[rgba(8,47,34,0.12)]
  bg-white
  p-5
  shadow-[0_14px_40px_rgba(8,47,34,0.07)]
"
```

## Detalhes

Ao clicar em “Ver detalhes”, abrir modal ou tela de detalhes com:

- Dados completos do agendamento.
- Informações do profissional.
- Endereço da barbearia.
- Forma de pagamento, se houver.
- Observações.
- Ações disponíveis.

## Reagendar

Ao clicar em “Reagendar”:

- Abrir fluxo de agendamento.
- Pré-selecionar o mesmo serviço.
- Opcionalmente pré-selecionar o mesmo profissional.
- Pedir nova data e horário.

---

# 17. Tela de Perfil

A aba “Perfil” deve mostrar e editar as informações básicas do cliente.

## Campos padrão

```txt
Nome completo
Telefone
E-mail
Data de nascimento
CPF, opcional
Gênero, opcional
Senha
Preferências de contato
```

## Estrutura

```txt
Header da tela
Avatar ou iniciais
Dados pessoais
Contato
Preferências
Botão salvar alterações
Botão sair da conta
```

## Tipo

```ts
type ClientProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate?: string;
  cpf?: string;
  gender?: string;
  avatarUrl?: string;
  contactPreferences?: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
};
```

## Visual

- Cards brancos.
- Inputs arredondados.
- Labels claros.
- Botão salvar em lime.
- Botão sair em estilo ghost/vermelho discreto.

## Input padrão

```tsx
className="
  h-12
  rounded-2xl
  border
  border-[rgba(8,47,34,0.12)]
  bg-white
  px-4
  text-sm
  font-medium
  text-[#0B3324]
  outline-none
  transition-all
  focus:border-[#A3E635]
  focus:ring-4
  focus:ring-[rgba(163,230,53,0.16)]
"
```

---

# 18. Tela de Planos

A aba “Planos” deve mostrar:

```txt
1. Card do plano atual
2. Benefícios do plano atual
3. Datas de início e renovação
4. Status da assinatura
5. Carrossel de planos disponíveis
6. Botão de assinar/trocar plano
```

---

# 19. Card do Plano Atual

## Se o cliente tem plano ativo

Mostrar:

- Nome do plano.
- Status.
- Data de início.
- Próxima renovação.
- Valor.
- Forma de pagamento.
- Benefícios.
- Botão “Gerenciar plano”.

Exemplo:

```txt
Plano atual
Plano Corte Premium
Ativo

Início: 10/05/2026
Renovação: 10/06/2026
R$ 89,90/mês

Benefícios:
- 2 cortes por mês
- 1 barba com desconto
- Prioridade em horários
```

## Se o cliente não tem plano

Mostrar:

```txt
Você ainda não possui um plano ativo.
Assine um plano para ter benefícios exclusivos na barbearia.
```

CTA:

```txt
Ver planos
```

## Visual

```tsx
className="
  relative
  overflow-hidden
  rounded-[32px]
  bg-[#082F22]
  p-6
  text-white
  shadow-[0_24px_70px_rgba(8,47,34,0.22)]
"
```

Adicionar detalhe lime:

```tsx
<div className="absolute right-[-40px] top-[-40px] size-32 rounded-full bg-[#A3E635]/20 blur-2xl" />
```

---

# 20. Carrossel de Planos

Abaixo do plano atual, mostrar planos disponíveis em carrossel horizontal.

## Tipo

```ts
type ClientPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "annual" | "custom";
  benefits: string[];
  isRecommended?: boolean;
};
```

## Card de plano

Mostrar:

- Nome.
- Descrição.
- Preço.
- Ciclo.
- Benefícios.
- Badge “Mais popular”, se houver.
- Botão “Assinar”.

## Layout

```tsx
className="
  flex
  snap-x
  gap-4
  overflow-x-auto
  px-5
  pb-2
  [-ms-overflow-style:none]
  [scrollbar-width:none]
"
```

Card:

```tsx
className="
  min-w-[82%]
  snap-center
  rounded-[30px]
  border
  border-[rgba(8,47,34,0.12)]
  bg-white
  p-5
  shadow-[0_18px_50px_rgba(8,47,34,0.08)]
"
```

Card recomendado:

```tsx
className="
  min-w-[82%]
  snap-center
  rounded-[30px]
  border
  border-[#A3E635]/60
  bg-[#082F22]
  p-5
  text-white
  shadow-[0_24px_70px_rgba(8,47,34,0.24)]
"
```

---

# 21. Tela de Checkout

Ao clicar em “Assinar”, abrir a tela de checkout.

## Rota recomendada

```txt
/barbearia/[slug]/checkout?planId=...
```

ou abrir como tela interna no shell.

## Estrutura

```txt
1. Header com voltar
2. Resumo do plano
3. Dados do cliente
4. Forma de pagamento
5. Campos de cartão, se cartão
6. Outras formas de pagamento
7. Resumo de cobrança
8. Botão confirmar assinatura
```

## Formas de pagamento

Permitir estrutura para:

```txt
Cartão de crédito
Pix
Boleto
Pagamento na barbearia, se configurado
```

## Cartão de crédito

Campos:

```txt
Nome no cartão
Número do cartão
Validade
CVV
CPF do titular
Parcelas, se houver
```

## Pix

Mostrar:

- Resumo.
- Botão gerar Pix.
- QR Code após geração.
- Código copia e cola.

## Boleto

Mostrar:

- Dados necessários.
- Botão gerar boleto.
- Link para visualizar boleto.

## Visual

- Checkout em cards.
- Muito claro e seguro.
- CTA lime.
- Selos de segurança discretos.
- Evitar excesso de campos visíveis de uma vez.
- Pode usar accordion por forma de pagamento.

---

# 22. Estados Vazios

Criar empty states para:

## Sem agendamento recente

```txt
Nenhum agendamento por enquanto.
Agende seu próximo atendimento em poucos cliques.
```

## Sem histórico

```txt
Seu histórico aparecerá aqui.
Quando você fizer um agendamento, ele será listado nesta tela.
```

## Sem plano ativo

```txt
Você ainda não possui um plano ativo.
Veja os planos disponíveis e escolha o melhor para você.
```

## Sem serviços disponíveis

```txt
Esta barbearia ainda não possui serviços disponíveis para agendamento.
```

---

# 23. Loading e Skeleton

Implementar skeletons mobile.

## Skeletons necessários

- Banner.
- Logo.
- Nome/slogan.
- Card de agendamento recente.
- Lista de serviços.
- Cards de plano.
- Histórico de agendamentos.

Visual:

```tsx
className="
  animate-pulse
  rounded-2xl
  bg-[rgba(8,47,34,0.08)]
"
```

---

# 24. Tratamento de Erros

Criar estados para:

- Barbearia não encontrada.
- Portal desativado.
- Serviço indisponível.
- Erro ao carregar planos.
- Erro ao carregar agendamentos.
- Erro no checkout.
- Falha no pagamento.

## Exemplo

```txt
Não conseguimos carregar este portal.
Tente novamente em alguns instantes.
```

Botão:

```txt
Tentar novamente
```

---

# 25. Regras de Mobile UX

Obrigatório:

- Botões com altura mínima de 44px.
- Bottom nav não pode cobrir CTA.
- Usar padding inferior extra por causa da bottom nav.
- Cards não podem ser largos demais.
- Textos devem quebrar corretamente.
- Evitar tabelas.
- Usar listas e cards.
- Usar scroll horizontal apenas em planos/chips.
- Não usar modais pequenos no mobile; preferir bottom sheet ou tela cheia.
- O botão principal deve ser fácil de alcançar com o polegar.

---

# 26. Componente Bottom Navigation

## Itens

```ts
const navItems = [
  { id: "home", label: "Início", icon: HomeIcon },
  { id: "appointments", label: "Agenda", icon: CalendarIcon },
  { id: "book", label: "Agendar", icon: PlusIcon, isMain: true },
  { id: "plans", label: "Planos", icon: BadgeIcon },
  { id: "profile", label: "Perfil", icon: UserIcon },
];
```

## Visual

```tsx
className="
  fixed
  inset-x-0
  bottom-0
  z-50
  mx-auto
  w-full
  max-w-[430px]
  px-4
  pb-[calc(12px+env(safe-area-inset-bottom))]
"
```

Container:

```tsx
className="
  flex
  items-center
  justify-between
  rounded-full
  border
  border-[rgba(8,47,34,0.10)]
  bg-white/92
  px-3
  py-2
  shadow-[0_18px_50px_rgba(8,47,34,0.16)]
  backdrop-blur-xl
"
```

Botão central:

```tsx
className="
  -mt-8
  grid
  size-14
  place-items-center
  rounded-full
  bg-[#082F22]
  text-[#A3E635]
  shadow-[0_16px_36px_rgba(8,47,34,0.24)]
  active:scale-95
"
```

---

# 27. Dados Mockados para Desenvolvimento

Criar mocks iniciais para testar a interface.

```ts
const mockCompany = {
  id: "company_1",
  slug: "urban-barbershop",
  name: "Urban Barbershop",
  slogan: "Estilo, confiança e atitude.",
  bannerUrl: "/images/mock/barbershop-banner.jpg",
  logoUrl: "/images/mock/barbershop-logo.png",
  address: "Av. Principal, 123",
  whatsapp: "5592999999999",
};

const mockServices = [
  {
    id: "service_1",
    name: "Corte Masculino",
    description: "Corte completo com acabamento.",
    durationMinutes: 30,
    price: 60,
    isAvailable: true,
  },
  {
    id: "service_2",
    name: "Barba",
    description: "Modelagem de barba com toalha quente.",
    durationMinutes: 20,
    price: 40,
    isAvailable: true,
  },
  {
    id: "service_3",
    name: "Corte + Barba",
    description: "Combo completo para cabelo e barba.",
    durationMinutes: 50,
    price: 90,
    isAvailable: true,
  },
];

const mockRecentAppointment = {
  id: "appointment_1",
  status: "confirmed",
  serviceName: "Corte + Barba",
  professionalName: "Rafael",
  date: "2026-05-12",
  time: "15:30",
  price: 90,
};

const mockPlans = [
  {
    id: "plan_1",
    name: "Plano Corte Essencial",
    description: "Ideal para manter o corte sempre em dia.",
    price: 79.9,
    billingCycle: "monthly",
    benefits: ["1 corte por mês", "Desconto em barba", "Agendamento rápido"],
  },
  {
    id: "plan_2",
    name: "Plano Premium",
    description: "Para quem quer cabelo e barba sempre alinhados.",
    price: 129.9,
    billingCycle: "monthly",
    isRecommended: true,
    benefits: ["2 cortes por mês", "1 barba inclusa", "Prioridade em horários"],
  },
];
```

---

# 28. Checklist de Implementação

## Etapa 1 — Base

- [ ] Criar rota `/barbearia/[slug]`.
- [ ] Criar `ClientPortalShell`.
- [ ] Criar sistema de abas internas.
- [ ] Criar bottom navigation fixa.
- [ ] Aplicar container mobile de até `430px`.
- [ ] Adicionar padding inferior para não cobrir conteúdo.

## Etapa 2 — Tela Inicial

- [ ] Criar banner personalizável.
- [ ] Criar logo circular sobreposta.
- [ ] Mostrar nome e slogan.
- [ ] Criar card de agendamento recente.
- [ ] Criar lista de serviços disponíveis.
- [ ] Criar botão “Agendar agora”.
- [ ] Tratar empty states.

## Etapa 3 — Agendamentos

- [ ] Criar aba de histórico.
- [ ] Criar filtros por status.
- [ ] Criar card de agendamento.
- [ ] Criar detalhe do agendamento.
- [ ] Criar ação de reagendar.

## Etapa 4 — Perfil

- [ ] Criar tela de dados pessoais.
- [ ] Criar formulário de edição.
- [ ] Criar preferências de contato.
- [ ] Criar salvar alterações.
- [ ] Criar botão sair.

## Etapa 5 — Planos

- [ ] Criar card do plano atual.
- [ ] Criar estado sem plano.
- [ ] Criar lista de benefícios.
- [ ] Criar carrossel de planos.
- [ ] Criar ação “Assinar”.

## Etapa 6 — Checkout

- [ ] Criar tela de checkout.
- [ ] Mostrar resumo do plano.
- [ ] Criar seleção de forma de pagamento.
- [ ] Criar campos de cartão.
- [ ] Criar opção Pix.
- [ ] Criar opção boleto.
- [ ] Criar resumo final.
- [ ] Criar botão confirmar assinatura.
- [ ] Criar estados de sucesso e erro.

## Etapa 7 — Polimento

- [ ] Adicionar skeletons.
- [ ] Adicionar loading states.
- [ ] Adicionar empty states.
- [ ] Adicionar feedback de erro.
- [ ] Garantir responsividade entre 320px e 430px.
- [ ] Testar bottom nav em iPhone com safe area.
- [ ] Verificar contraste.
- [ ] Verificar se todos os botões têm `active:scale-95`.
- [ ] Verificar se todos os cards seguem radius do Bigood.
- [ ] Verificar se o portal parece um app mobile.

---

# 29. Restrições Importantes

Não fazer:

- Não usar o estilo laranja da imagem de referência.
- Não usar cards quadrados.
- Não usar banner sem overlay.
- Não usar layout desktop.
- Não usar tabela para serviços.
- Não esconder bottom navigation.
- Não criar tela inicial poluída.
- Não colocar carrossel de fotos na home.
- Não misturar paletas fora do Bigood.
- Não usar fontes diferentes.
- Não criar componentes grandes demais no mobile.

Fazer:

- Seguir Bigood.
- Mobile-first.
- Estilo app.
- CTA lime.
- Verde profundo.
- Cards arredondados.
- Bottom nav flutuante.
- Interface limpa.
- Agendamento simples.
- Planos claros.
- Checkout confiável.

---

# 30. Prompt Final para o Codex

```txt
Crie do zero o Portal Mobile do Cliente da barbearia para o Bigood.

Use a disposição visual das imagens de referência apenas como base estrutural, mas ignore completamente o estilo, cores e identidade delas.

Siga 100% o Design System do Bigood:
- Fundo #F8FAFC
- Verde profundo #082F22
- Verde principal #0B3324
- Lime #A3E635 para CTAs e destaques
- Cards brancos com border suave
- Radius grande entre 22px e 32px
- Tipografia Plus Jakarta Sans
- Bottom navigation flutuante estilo app
- Mobile-first com largura máxima de 430px
- Sombras suaves e aparência SaaS premium

A página deve funcionar como um mini app com abas:
- Início
- Agendamentos
- Agendar
- Planos
- Perfil

Na tela inicial, criar:
- Banner personalizável da barbearia
- Logo circular sobreposta ao banner
- Nome da barbearia
- Slogan
- Card do agendamento mais recente
- Lista de serviços disponíveis
- Botão Agendar agora

Na aba Agendamentos:
- Mostrar histórico completo
- Filtros por status
- Card de agendamento
- Ver detalhes
- Reagendar

Na aba Perfil:
- Mostrar e editar dados básicos do cliente
- Nome, telefone, e-mail, nascimento, CPF opcional e preferências de contato

Na aba Planos:
- Card do plano atual ou estado sem plano
- Datas de início e renovação
- Benefícios
- Carrossel de planos disponíveis
- Botão de assinar

Ao clicar em assinar:
- Abrir checkout com resumo do plano
- Dados do cliente
- Forma de pagamento
- Cartão, Pix, boleto ou pagamento na barbearia se configurado
- Confirmar assinatura

Ao clicar em Agendar:
- Abrir fluxo mobile de agendamento em etapas:
  1. Serviço
  2. Profissional
  3. Data
  4. Horário
  5. Confirmação

Use componentes reutilizáveis, TypeScript, Tailwind CSS e shadcn/ui quando fizer sentido.
```