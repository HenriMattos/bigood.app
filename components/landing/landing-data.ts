import {
  Building03Icon,
  Calendar03Icon,
  CashierIcon,
  ChartIncreaseIcon,
  CreditCardIcon,
  DashboardSquare03Icon,
  Login01Icon,
  PaintBoardIcon,
  ScissorIcon,
  SmartPhone01Icon,
  StoreManagement01Icon,
  UserAdd01Icon,
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
  { label: "Produto", href: "#produto" },
  { label: "Recursos", href: "#recursos" },
  { label: "Planos", href: "#planos" },
  { label: "Duvidas", href: "#duvidas" },
]

export const trustItems = [
  "Agenda online",
  "Clientes e historico",
  "Profissionais e servicos",
  "Financeiro",
  "Assinaturas",
  "Multiunidades",
]

export const painPoints = [
  {
    title: "Agenda desorganizada",
    description:
      "Horarios perdidos, remarcacoes manuais e clientes dependendo de mensagens para confirmar atendimento.",
    icon: Calendar03Icon,
  },
  {
    title: "Financeiro sem clareza",
    description:
      "Entradas, saidas, comandas e formas de pagamento sem uma visao real do resultado da barbearia.",
    icon: CashierIcon,
  },
  {
    title: "Receita sem recorrencia",
    description:
      "Sem planos e assinaturas bem controlados, a barbearia fica presa ao faturamento avulso.",
    icon: CreditCardIcon,
  },
  {
    title: "Equipe sem controle",
    description:
      "Profissionais, servicos, horarios e comissoes funcionando sem uma gestao centralizada.",
    icon: UserMultipleIcon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const productPillars = [
  {
    title: "Painel central da operacao",
    description:
      "Agenda, clientes, caixa, financeiro e desempenho em uma unica visao para decidir rapido.",
    icon: DashboardSquare03Icon,
  },
  {
    title: "Agenda online",
    description:
      "Agendamento, consulta de horarios e acompanhamento de planos em uma experiencia simples e bonita.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Recorrencia no controle",
    description:
      "Venda planos, acompanhe beneficios e ganhe previsibilidade sem depender de planilhas.",
    icon: CreditCardIcon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const features = [
  {
    title: "Agendamento online",
    description:
      "Organize horarios, bloqueios, profissionais e servicos em uma agenda clara para o dia a dia.",
    icon: Calendar03Icon,
  },
  {
    title: "Gestao de clientes",
    description:
      "Cadastre clientes, acompanhe historico e identifique oportunidades de recompra e fidelizacao.",
    icon: UserGroupIcon,
  },
  {
    title: "Controle de equipe",
    description:
      "Gerencie barbeiros, horarios, comissoes, funcoes e exibicao dos servicos da equipe.",
    icon: ScissorIcon,
  },
  {
    title: "Planos e assinaturas",
    description:
      "Venda recorrencia, acompanhe inadimplencia e aumente previsibilidade de receita.",
    icon: CreditCardIcon,
  },
  {
    title: "Financeiro completo",
    description:
      "Veja receitas, despesas, caixa, comandas, categorias e relatorios importantes da operacao.",
    icon: ChartIncreaseIcon,
  },
  {
    title: "Agenda online",
    description:
      "Entregue uma experiencia moderna para agendar, consultar horarios e acompanhar planos.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Caixa e comandas",
    description:
      "Registre pagamentos, entradas, saidas e acompanhe a movimentacao financeira do dia.",
    icon: CashierIcon,
  },
  {
    title: "Personalizacao da marca",
    description:
      "Configure dados da empresa, contatos, logo, icone e imagens comerciais.",
    icon: PaintBoardIcon,
  },
  {
    title: "Multiunidades",
    description:
      "Gerencie ate 3 unidades no Plano Pro e fale com a equipe para operacoes maiores.",
    icon: Building03Icon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const flowSteps = [
  {
    title: "Escolha o plano",
    description:
      "Compare as opcoes e siga com o Pro Mensal, Pro Anual ou Personalizado.",
    icon: Calendar03Icon,
    href: "#planos",
    cta: "Ver planos",
  },
  {
    title: "Cadastre a barbearia",
    description:
      "A tela de cadastro ja recebe o plano escolhido e coleta os dados comerciais.",
    icon: UserAdd01Icon,
    href: "/cadastro?plan=pro-anual",
    cta: "Abrir cadastro",
  },
  {
    title: "Confirme no checkout",
    description:
      "Revise plano, pagamento e regra de transicao de sistema antes de concluir.",
    icon: CreditCardIcon,
    href: "/checkout?plan=pro-anual",
    cta: "Ver checkout",
  },
  {
    title: "Entre no painel",
    description:
      "Depois da confirmacao, o acesso fica sempre na landing em Conta > Meu painel.",
    icon: Login01Icon,
    href: "/login",
    cta: "Meu painel",
  },
] satisfies Array<{
  title: string
  description: string
  icon: IconSvgElement
  href: string
  cta: string
}>

export const multiUnitCards = [
  {
    title: "1 a 3 unidades",
    description:
      "Use o Plano Pro para operar pequenas e medias barbearias com uma estrutura profissional.",
    icon: Building03Icon,
  },
  {
    title: "4 ou mais unidades",
    description:
      "Fale com a equipe para montar um plano personalizado para redes, franquias ou operacoes maiores.",
    icon: StoreManagement01Icon,
  },
  {
    title: "Condicoes especiais",
    description:
      "Pix, boleto, transferencia, contrato, migracao assistida e suporte prioritario entram no Personalizado.",
    icon: CreditCardIcon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const plans = [
  {
    key: "pro-mensal",
    name: "Pro Mensal",
    badge: "Entrada mensal",
    price: "R$ 220",
    period: "/mes",
    description:
      "Para barbearias que querem comecar com uma gestao profissional sem compromisso anual.",
    highlighted: false,
    cta: "Assinar mensal",
    payment: "Pagamento padrao por cartao de credito.",
    transition: "Taxa de transicao de sistema pode ser aplicada.",
    features: [
      "Ate 3 unidades",
      "Agenda online",
      "Agenda online para clientes",
      "Gestao de clientes",
      "Caixa e comandas",
      "Financeiro",
      "Planos e assinaturas",
      "Gestao de profissionais e servicos",
      "Suporte padrao",
    ],
  },
  {
    key: "pro-anual",
    name: "Pro Anual",
    badge: "Mais recomendado",
    price: "R$ 2.100",
    period: "/ano",
    description:
      "A melhor opcao para economizar, ter mais flexibilidade de pagamento e migrar sem custo adicional.",
    highlighted: true,
    cta: "Assinar anual",
    payment: "Cartao, Pix, boleto, transferencia ou contrato aprovado.",
    transition: "Transicao de sistema gratis.",
    features: [
      "Tudo do Plano Pro",
      "Ate 3 unidades",
      "Economia de R$ 540 por ano",
      "Equivalente a R$ 175/mes",
      "Transicao de sistema gratis",
      "Outras formas de pagamento",
      "Melhor custo-beneficio",
      "Suporte padrao",
    ],
  },
  {
    key: "personalizado",
    name: "Personalizado",
    badge: "Para redes e franquias",
    price: "Sob consulta",
    period: "",
    description:
      "Para barbearias com mais de 3 unidades, necessidades comerciais especiais ou operacao avancada.",
    highlighted: false,
    cta: "Falar com especialista",
    payment:
      "Cartao, Pix, boleto, transferencia, contrato ou condicao comercial personalizada.",
    transition: "Transicao de sistema personalizada conforme operacao.",
    features: [
      "4 ou mais unidades",
      "Condicoes comerciais personalizadas",
      "Pagamento por Pix, boleto, transferencia, cartao ou contrato",
      "Suporte prioritario",
      "Transicao de sistema personalizada",
      "Treinamento da equipe",
      "Solucao para clientes sem limite no cartao",
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

export const comparisonRows = [
  ["Preco", "R$ 220/mes", "R$ 2.100/ano", "Sob consulta"],
  ["Equivalente mensal", "R$ 220/mes", "R$ 175/mes", "Sob consulta"],
  ["Unidades inclusas", "Ate 3", "Ate 3", "4 ou mais"],
  ["Agenda online", "Sim", "Sim", "Sim"],
  ["Agenda online para clientes", "Sim", "Sim", "Sim"],
  ["Gestao de clientes", "Sim", "Sim", "Sim"],
  ["Caixa e comandas", "Sim", "Sim", "Sim"],
  ["Financeiro", "Sim", "Sim", "Sim"],
  ["Planos e assinaturas", "Sim", "Sim", "Sim"],
  ["Profissionais e servicos", "Sim", "Sim", "Sim"],
  ["Personalizacao da marca", "Sim", "Sim", "Sim"],
  ["Transicao de sistema", "Pode ser aplicada", "Gratis", "Personalizada"],
  ["Pagamento por cartao", "Sim", "Sim", "Sim"],
  ["Pagamento por Pix", "Nao no padrao", "Sim", "Sim"],
  ["Pagamento por boleto", "Nao no padrao", "Sim", "Sim"],
  ["Pagamento por transferencia", "Nao no padrao", "Sim", "Sim"],
  ["Pagamento por contrato", "Nao no padrao", "Sob aprovacao", "Sim"],
  ["Suporte prioritario", "Nao", "Nao", "Sim"],
  ["Treinamento da equipe", "Nao", "Nao", "Sob consulta"],
]

export const valueMetrics = [
  { value: "32", label: "agendamentos organizados por dia" },
  { value: "86", label: "assinaturas ativas acompanhadas" },
  { value: "3", label: "unidades inclusas no Plano Pro" },
  { value: "R$ 540", label: "de economia no plano anual" },
]

export const dashboardMetrics = [
  {
    label: "Receita mensal",
    value: "R$ 18.420",
    detail: "+14% no mes",
    icon: ChartIncreaseIcon,
  },
  {
    label: "Agenda de hoje",
    value: "32 horarios",
    detail: "8 pendentes de confirmacao",
    icon: Calendar03Icon,
  },
  {
    label: "Assinaturas ativas",
    value: "86 clientes",
    detail: "R$ 7.920 em recorrencia",
    icon: UserMultipleIcon,
  },
  {
    label: "Plano Pro",
    value: "Ate 3 unidades",
    detail: "Gestao centralizada",
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
    question: "O Bigood tem plano gratuito?",
    answer:
      "Nao. O Bigood e uma plataforma premium para barbearias que querem uma gestao profissional. Os planos comecam em R$ 220 por mes.",
  },
  {
    question: "Quantas unidades posso gerenciar no Plano Pro?",
    answer:
      "O Plano Pro inclui ate 3 unidades. Para barbearias com 4 ou mais unidades, oferecemos o Plano Personalizado.",
  },
  {
    question: "Qual a diferenca entre mensal e anual?",
    answer:
      "No mensal, o valor e R$ 220 por mes. No anual, o valor e R$ 2.100 por ano, equivalente a R$ 175 por mes, com economia de R$ 540 por ano.",
  },
  {
    question: "Existe taxa de implantacao?",
    answer:
      "Nao usamos taxa de implantacao. Quando necessario, a cobranca e referente a transicao de sistema, ou seja, ao processo de migracao de outro sistema para o Bigood.",
  },
  {
    question: "A transicao de outro sistema e cobrada?",
    answer:
      "No Plano Mensal, a taxa de transicao de sistema pode ser aplicada. No Plano Anual, a transicao e gratuita. No Plano Personalizado, a transicao e definida conforme a operacao.",
  },
  {
    question: "Quais formas de pagamento o Bigood aceita?",
    answer:
      "No Plano Mensal padrao, o pagamento e feito por cartao de credito. No Plano Anual, tambem aceitamos Pix, boleto, transferencia e contrato aprovado. No Plano Personalizado, as formas de pagamento sao definidas com a equipe.",
  },
  {
    question: "E se eu nao tiver limite no cartao?",
    answer:
      "Nesse caso, voce pode escolher o Plano Anual com outras formas de pagamento ou falar com nossa equipe para uma condicao personalizada.",
  },
  {
    question: "O sistema serve para barbearia com mais de uma filial?",
    answer:
      "Sim. O Plano Pro atende ate 3 unidades. Para redes, franquias ou operacoes com 4 ou mais unidades, recomendamos o Plano Personalizado.",
  },
  {
    question: "O cliente da barbearia tambem acessa o sistema?",
    answer:
      "Sim. O Bigood tera uma experiencia de agendamento para clientes finais. Essa area sera recriada em uma etapa propria da refatoracao.",
  },
  {
    question: "Posso migrar de outro sistema?",
    answer:
      "Sim. O Bigood permite transicao de outro sistema. No Plano Anual, essa transicao e gratuita. No Mensal, pode haver cobranca. No Personalizado, a transicao e definida conforme o tamanho da operacao.",
  },
]
