import {
  Building03Icon,
  Calendar03Icon,
  CashierIcon,
  ChartIncreaseIcon,
  CreditCardIcon,
  DashboardSquare03Icon,
  PaintBoardIcon,
  ScissorIcon,
  SmartPhone01Icon,
  StoreManagement01Icon,
  UserGroupIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export type PlanKey = "pro-mensal" | "pro-anual" | "personalizado"

export const planLabels: Record<PlanKey, string> = {
  "pro-mensal": "Pro Mensal",
  "pro-anual": "Pro Anual",
  personalizado: "Personalizado",
}

export const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Recursos", href: "#recursos" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Portal", href: "#portal-cliente" },
  { label: "Preço", href: "#planos" },
  { label: "Dúvidas", href: "#duvidas" },
]

export const trustItems = [
  "Agenda online",
  "Caixa e comandas",
  "Planos recorrentes",
  "Portal do cliente",
]

export const painPoints = [
  {
    title: "Agenda no improviso",
    description:
      "Horário perdido, remarcação manual e cliente esperando no WhatsApp.",
    icon: Calendar03Icon,
  },
  {
    title: "Caixa sem visão clara",
    description: "Comanda, pagamento e fechamento espalhados no fim do dia.",
    icon: CashierIcon,
  },
  {
    title: "Clientes sem recorrência",
    description:
      "Sem assinatura, a barbearia depende só do atendimento avulso.",
    icon: CreditCardIcon,
  },
  {
    title: "Sistema que não entende barbearia",
    description:
      "Tela demais, rotina pesada e pouco foco no dia a dia do barbeiro.",
    icon: DashboardSquare03Icon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const clientPlanExamples = [
  {
    name: "Plano Corte Mensal",
    benefit: "1 ou 2 cortes por mês com valor fixo.",
    frequency: "Renovação mensal",
    status: "Ativo",
    subscriber: "Cliente: Rafael M.",
  },
  {
    name: "Plano Corte + Barba",
    benefit: "2 cortes + 1 barba por mês.",
    frequency: "Renova em 12 dias",
    status: "Renovando",
    subscriber: "Cliente: Diego S.",
  },
  {
    name: "Plano Premium",
    benefit: "Prioridade de horário e serviços inclusos.",
    frequency: "Ciclo mensal",
    status: "Ativo",
    subscriber: "Cliente: Marcos A.",
  },
  {
    name: "Plano Fidelidade",
    benefit: "Vantagens para clientes recorrentes.",
    frequency: "Vence em breve",
    status: "Vence em breve",
    subscriber: "Cliente: Lucas P.",
  },
]

export const flowSteps = [
  {
    title: "Configure sua barbearia",
    description:
      "Cadastre serviços, profissionais, horários, unidades e identidade do portal do cliente.",
    icon: PaintBoardIcon,
  },
  {
    title: "Receba agendamentos",
    description:
      "O cliente agenda pelo portal, escolhe serviço, profissional, data e horário.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Controle o atendimento",
    description:
      "Acompanhe agenda, comandas, caixa, clientes e histórico em um painel único.",
    icon: CashierIcon,
  },
  {
    title: "Venda planos recorrentes",
    description:
      "Crie planos de assinatura, controle benefícios, acompanhe renovações e aumente previsibilidade.",
    icon: CreditCardIcon,
  },
  {
    title: "Acompanhe o crescimento",
    description:
      "Veja receita, clientes ativos, assinaturas, agendamentos e desempenho da operação.",
    icon: ChartIncreaseIcon,
  },
] satisfies Array<{
  title: string
  description: string
  icon: IconSvgElement
}>

export const features = [
  {
    title: "Agenda online",
    description: "Clientes agendam pelo celular e a barbearia acompanha tudo.",
    icon: Calendar03Icon,
  },
  {
    title: "Portal do cliente",
    description: "Serviços, horários, planos e agendamentos em um portal.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Planos e assinaturas",
    description: "Controle benefícios, status, início e renovação.",
    icon: CreditCardIcon,
  },
  {
    title: "Caixa e comandas",
    description: "Atendimentos, pagamentos e fechamento com mais clareza.",
    icon: CashierIcon,
  },
  {
    title: "Gestão de clientes",
    description: "Histórico, preferências, planos ativos e relacionamento.",
    icon: UserGroupIcon,
  },
  {
    title: "Profissionais e serviços",
    description: "Equipe, horários, valores, serviços e disponibilidade.",
    icon: ScissorIcon,
  },
  {
    title: "Financeiro",
    description: "Faturamento, pagamentos, recorrência e visão geral.",
    icon: ChartIncreaseIcon,
  },
  {
    title: "Multiunidades",
    description: "Até 3 unidades no Pro e operações maiores no Personalizado.",
    icon: Building03Icon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const plans = [
  {
    key: "pro-mensal",
    name: "Pro Mensal",
    badge: "Entrada mensal",
    price: "R$ 220",
    period: "/mês",
    description:
      "Para barbearias que querem começar com gestão profissional sem compromisso anual.",
    highlighted: false,
    cta: "Assinar mensal",
    payment: "Pagamento padrão por cartão de crédito.",
    transition: "Taxa de transição de sistema pode ser aplicada.",
    features: [
      "Agenda online",
      "Portal do cliente",
      "Gestão de clientes",
      "Caixa e comandas",
      "Financeiro",
      "Planos de assinatura para seus clientes",
      "Gestão de profissionais e serviços",
      "Até 3 unidades no Plano Pro",
      "Suporte padrão",
    ],
  },
  {
    key: "pro-anual",
    name: "Pro Anual",
    badge: "Mais recomendado",
    price: "R$ 2.100",
    period: "/ano",
    description:
      "Equivalente a R$ 175 por mês. A melhor opção para economizar e migrar sem custo adicional.",
    highlighted: true,
    cta: "Assinar anual",
    payment: "Cartão, Pix, boleto, transferência ou contrato aprovado.",
    transition: "Transição de sistema grátis.",
    features: [
      "Tudo do Plano Pro",
      "Agenda online",
      "Portal do cliente",
      "Controle de clientes assinantes",
      "Planos de assinatura para seus clientes",
      "Transição de sistema grátis",
      "Economia de R$ 540 por ano",
      "Até 3 unidades no Plano Pro",
      "Suporte padrão",
    ],
  },
  {
    key: "personalizado",
    name: "Personalizado",
    badge: "Para 4+ unidades",
    price: "Sob consulta",
    period: "",
    description:
      "Para barbearias com 4 ou mais unidades, operação maior, contrato especial ou necessidades avançadas.",
    highlighted: false,
    cta: "Falar conosco",
    payment:
      "Cartão, Pix, boleto, transferência, contrato ou condição comercial personalizada.",
    transition: "Transição de sistema personalizada conforme operação.",
    features: [
      "4 ou mais unidades",
      "Condições comerciais personalizadas",
      "Controle de clientes assinantes",
      "Suporte prioritário",
      "Transição de sistema personalizada",
      "Treinamento da equipe",
      "Contrato especial para operações maiores",
    ],
  },
] satisfies Array<{
  key: PlanKey
  name: string
  badge: string
  price: string
  period: string
  description: string
  highlighted: boolean
  cta: string
  payment: string
  transition: string
  features: string[]
}>

export const dashboardMetrics = [
  {
    label: "Agenda de hoje",
    value: "32 horários",
    detail: "Serviços, profissionais e confirmações em uma tela.",
    icon: Calendar03Icon,
  },
  {
    label: "Clientes assinantes",
    value: "86 ativos",
    detail: "Planos, benefícios e status acompanhados.",
    icon: UserMultipleIcon,
  },
  {
    label: "Planos ativos",
    value: "R$ 7.920",
    detail: "Receita mensal prevista em assinaturas.",
    icon: CreditCardIcon,
  },
  {
    label: "Caixa do dia",
    value: "R$ 2.840",
    detail: "Comandas, pagamentos e fechamento organizados.",
    icon: CashierIcon,
  },
  {
    label: "Serviços mais vendidos",
    value: "Corte + barba",
    detail: "Histórico para entender demanda e equipe.",
    icon: ScissorIcon,
  },
  {
    label: "Renovações próximas",
    value: "14 clientes",
    detail: "Planos que precisam de acompanhamento.",
    icon: StoreManagement01Icon,
  },
] satisfies Array<{
  label: string
  value: string
  detail: string
  icon: IconSvgElement
}>

export const faqs = [
  {
    question: "O Bigood é só uma agenda online?",
    answer:
      "Não. O Bigood é um sistema completo para gerenciar agenda, clientes, profissionais, serviços, caixa, financeiro e planos de assinatura da barbearia.",
  },
  {
    question: "Consigo vender planos de assinatura para meus clientes?",
    answer:
      "Sim. A barbearia pode criar planos, definir benefícios, acompanhar clientes assinantes, controlar início, renovação e status.",
  },
  {
    question: "O cliente consegue agendar pelo celular?",
    answer:
      "Sim. Cada barbearia pode ter um portal para o cliente escolher serviço, profissional, data e horário.",
  },
  {
    question: "O sistema serve para barbearias pequenas?",
    answer:
      "Sim. O Bigood foi pensado para barbearias que querem sair do improviso e organizar a operação desde cedo.",
  },
  {
    question: "Tenho mais de uma unidade. Posso usar?",
    answer:
      "Sim. O Plano Pro cobre até 3 unidades. Operações com 4 ou mais unidades entram no Plano Personalizado.",
  },
  {
    question: "O Bigood foi criado por barbeiros?",
    answer:
      "O Bigood foi desenvolvido com apoio real de um barbeiro consultor, com anos de experiência na própria barbearia e participação direta na validação das necessidades do sistema.",
  },
]


