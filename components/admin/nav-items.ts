import {
  Building02Icon,
  Calendar03Icon,
  ChartIncreaseIcon,
  CrownIcon,
  DashboardSquare01Icon,
  Invoice03Icon,
  ScissorIcon,
  UserAdd01Icon,
  UserListIcon,
  UserMultipleIcon,
  UserStar01Icon,
  Wallet02Icon,
  Bank02Icon,
  File01Icon,
  CreditCard02Icon,
} from "@hugeicons/core-free-icons"

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: DashboardSquare01Icon,
    description: "Visao geral da barbearia",
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar03Icon,
    description: "Horarios, barbeiros e confirmacoes",
  },
  {
    title: "Caixa",
    href: "/caixa",
    icon: Wallet02Icon,
    description: "Entradas, saidas e fechamento",
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: UserMultipleIcon,
    description: "Cadastro, historico e recorrencia",
    children: [
      {
        title: "Cadastrar cliente",
        href: "/clientes/cadastrar",
        icon: UserAdd01Icon,
      },
      {
        title: "Listagem de clientes",
        href: "/clientes/listagem",
        icon: UserListIcon,
      },
      {
        title: "Cliente recompras",
        href: "/clientes/recompras",
        icon: UserStar01Icon,
      },
    ],
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: ChartIncreaseIcon,
    description: "Receitas, despesas e metas",
    children: [
      {
        title: "Contas bancárias",
        href: "/financeiro/contas-bancarias",
        icon: Bank02Icon,
      },
      {
        title: "Categorias Financeiras",
        href: "/financeiro/categorias",
        icon: File01Icon,
      },
      {
        title: "Formas de pagamento",
        href: "/financeiro/formas-pagamento",
        icon: CreditCard02Icon,
      },
    ],
  },
  {
    title: "Planos",
    href: "/planos",
    icon: CrownIcon,
    description: "Assinaturas e beneficios",
  },
  {
    title: "Servicos",
    href: "/servicos",
    icon: ScissorIcon,
    description: "Catalogo, precos e duracao",
  },
  {
    title: "Empresa",
    href: "/empresa",
    icon: Building02Icon,
    description: "Dados comerciais e operacionais",
  },
] as const

export const quickActions = [
  "Novo agendamento",
  "Receber pagamento",
  "Cadastrar cliente",
  "Fechar caixa",
] as const

export const invoiceIcon = Invoice03Icon
